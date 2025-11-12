import { prisma } from '../../config/prisma';
import { PaginationParams, getSkip } from '../../lib/pagination';

export interface CreateSkillData {
  name: string;
  description: string;
  isActive?: boolean;
}

export interface UpdateSkillData {
  name?: string;
  description?: string;
  isActive?: boolean;
}

export const skillRepository = {
  async list({ isActive, page, limit }: { isActive?: boolean; page: number; limit: number }) {
    const where: { isActive?: boolean } = {};
    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    const [items, total] = await Promise.all([
      prisma.skill.findMany({
        where,
        skip: getSkip(page, limit),
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.skill.count({ where }),
    ]);

    return { items, total };
  },

  async getById(id: string) {
    return prisma.skill.findUnique({
      where: { id },
    });
  },

  async create(data: CreateSkillData) {
    return prisma.skill.create({
      data: {
        name: data.name,
        description: data.description,
        isActive: data.isActive ?? true,
      },
    });
  },

  async update(id: string, data: UpdateSkillData) {
    return prisma.skill.update({
      where: { id },
      data,
    });
  },

  async softDelete(id: string) {
    return prisma.skill.update({
      where: { id },
      data: { isActive: false },
    });
  },

  async existsByName(name: string, excludeId?: string) {
    const where: { name: { mode: 'insensitive'; equals: string }; id?: { not: string } } = {
      name: { mode: 'insensitive', equals: name },
    };
    if (excludeId) {
      where.id = { not: excludeId };
    }
    const count = await prisma.skill.count({ where });
    return count > 0;
  },
};

