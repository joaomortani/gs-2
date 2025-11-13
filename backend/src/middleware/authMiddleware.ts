import express from 'express';
import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import env from '../config/env';
import { sendError } from '../lib/apiResponse';
import { prisma } from '../config/prisma';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: string;
      };
    }
  }
}

function unauthorized(res: Response): void {
  sendError(res, 401, { code: 'UNAUTHORIZED', message: 'Unauthorized' });
}

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const authorization = req.header('authorization');

  if (!authorization) {
    unauthorized(res);
    return;
  }

  const [scheme, token] = authorization.split(' ');

  if (scheme?.toLowerCase() !== 'bearer' || !token) {
    unauthorized(res);
    return;
  }

  try {
    const decoded = jwt.verify(token, env.jwtAccessSecret);

    if (typeof decoded !== 'object' || decoded === null) {
      unauthorized(res);
      return;
    }

    const payload = decoded as jwt.JwtPayload & { userId?: string };
    const userId = payload.sub ?? payload.userId;

    if (!userId || typeof userId !== 'string') {
      unauthorized(res);
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true, isActive: true },
    });

    if (!user) {
      console.error(`[AUTH] User not found: ${userId}`);
      unauthorized(res);
      return;
    }

    if (!user.isActive) {
      console.error(`[AUTH] User is inactive: ${userId} (role: ${user.role})`);
      unauthorized(res);
      return;
    }

    req.user = { id: user.id, role: user.role };
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      console.error('[AUTH] JWT Error:', error.message);
    } else if (error instanceof jwt.TokenExpiredError) {
      console.error('[AUTH] Token expired');
    } else {
      console.error('[AUTH] Unknown error:', error);
    }
    unauthorized(res);
  }
}

export function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (!req.user) {
    sendError(res, 401, { code: 'UNAUTHORIZED', message: 'Unauthorized' });
    return;
  }

  if (req.user.role !== 'admin') {
    sendError(res, 403, { code: 'FORBIDDEN', message: 'Forbidden' });
    return;
  }

  next();
}
