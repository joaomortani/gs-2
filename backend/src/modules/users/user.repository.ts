import bcrypt from 'bcrypt';
import { prisma } from '../../config/prisma';
import { getSkip } from '../../lib/pagination';
import type { CreateUserDTO, UpdateUserDTO } from './user.dto';

export const userRepository = {
  async list({ page, limit, search, isActive }: { page: number; limit: number; search?: string; isActive?: boolean }) {
    const where: {
      OR?: Array<{ name: { contains: string; mode: 'insensitive' } } | { email: { contains: string; mode: 'insensitive' } }>;
      isActive?: boolean;
    } = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    const [items, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip: getSkip(page, limit),
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.user.count({ where }),
    ]);

    return { items, total };
  },

  async getById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  },

  async create(data: CreateUserDTO) {
    const passwordHash = await bcrypt.hash(data.password, 10);
    
    return prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash,
        role: data.role || 'user',
        isActive: data.isActive ?? true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  },

  async update(id: string, data: UpdateUserDTO) {
    const updateData: {
      name?: string;
      email?: string;
      role?: string;
      isActive?: boolean;
    } = {};

    if (data.name !== undefined) updateData.name = data.name;
    if (data.email !== undefined) updateData.email = data.email;
    if (data.role !== undefined) updateData.role = data.role;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;

    return prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  },

  async existsByEmail(email: string, excludeId?: string) {
    const where: { email: string; id?: { not: string } } = { email };
    if (excludeId) {
      where.id = { not: excludeId };
    }
    const count = await prisma.user.count({ where });
    return count > 0;
  },
};

