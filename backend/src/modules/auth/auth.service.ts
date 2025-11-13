import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto';

import env from '../../config/env';
import { prisma } from '../../config/prisma';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface LoginResult {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

export class UnauthorizedError extends Error {
  statusCode: number;

  constructor(message = 'Unauthorized') {
    super(message);
    this.name = 'UnauthorizedError';
    this.statusCode = 401;
  }
}

export class NotFoundError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = 404;
  }
}

export class ConflictError extends Error {
  statusCode: number;

  constructor(message = 'Resource already exists') {
    super(message);
    this.name = 'ConflictError';
    this.statusCode = 409;
  }
}

function parseExpiresInToMilliseconds(expiresIn: string): number {
  const trimmed = expiresIn.trim();

  if (!trimmed) {
    throw new Error('Expiration value cannot be empty');
  }

  const match = trimmed.match(/^(\d+)(ms|s|m|h|d|w|y)?$/i);

  if (!match) {
    throw new Error(`Unsupported expiration format: ${expiresIn}`);
  }

  const value = Number(match[1]);
  const unit = match[2]?.toLowerCase();

  const multipliers: Record<string, number> = {
    ms: 1,
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
    w: 7 * 24 * 60 * 60 * 1000,
    y: 365.25 * 24 * 60 * 60 * 1000,
  };

  if (!unit) {
    return value * multipliers.s;
  }

  const multiplier = multipliers[unit];

  if (!multiplier) {
    throw new Error(`Unsupported expiration unit: ${unit}`);
  }

  return value * multiplier;
}

export const login = async (email: string, password: string): Promise<LoginResult> => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new UnauthorizedError('Invalid credentials');
  }

  if (!user.isActive) {
    throw new UnauthorizedError('User is inactive');
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);

  if (!passwordMatches) {
    throw new UnauthorizedError('Invalid credentials');
  }

  const accessToken = jwt.sign(
    { sub: user.id },
    env.jwtAccessSecret,
    { expiresIn: env.jwtAccessExpiresIn } as jwt.SignOptions,
  );

  const refreshToken = randomBytes(48).toString('hex');
  const expiresInMs = parseExpiresInToMilliseconds(env.jwtRefreshExpiresIn);
  const expiresAt = new Date(Date.now() + expiresInMs);

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt,
    },
  });

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    accessToken,
    refreshToken,
  };
};

export const refreshAccessToken = async (refreshToken: string): Promise<string> => {
  const storedToken = await prisma.refreshToken.findUnique({
    where: { token: refreshToken },
  });

  if (!storedToken) {
    throw new UnauthorizedError('Invalid refresh token');
  }

  if (storedToken.expiresAt.getTime() <= Date.now()) {
    await prisma.refreshToken.delete({ where: { id: storedToken.id } });
    throw new UnauthorizedError('Refresh token expired');
  }

  const user = await prisma.user.findUnique({
    where: { id: storedToken.userId },
    select: { id: true, isActive: true },
  });

  if (!user) {
    await prisma.refreshToken.delete({ where: { id: storedToken.id } });
    throw new UnauthorizedError('Invalid refresh token');
  }

  if (!user.isActive) {
    await prisma.refreshToken.deleteMany({ where: { userId: user.id } });
    throw new UnauthorizedError('User is inactive');
  }

  const accessToken = jwt.sign(
    { sub: user.id },
    env.jwtAccessSecret,
    { expiresIn: env.jwtAccessExpiresIn } as jwt.SignOptions,
  );

  return accessToken;
};

export const logout = async (refreshToken: string): Promise<void> => {
  await prisma.refreshToken.deleteMany({
    where: { token: refreshToken },
  });
};

export const getUserProfile = async (userId: string): Promise<AuthUser> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });

  if (!user) {
    throw new NotFoundError('User not found');
  }

  return user;
};

export const registerUser = async (name: string, email: string, password: string): Promise<AuthUser> => {
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return user;
  } catch (error: unknown) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        // P2002 é o código de erro do Prisma para violação de constraint única
        throw new ConflictError('User with this email already exists');
      }
    }
    console.error('Erro ao criar usuário:', error);
    throw new Error('Failed to create user');
  }
};
