import { prisma } from '../../config/prisma';
import { getSkip } from '../../lib/pagination';

export interface CreateChallengeData {
  skillId: string;
  title: string;
  description: string;
  orderIndex: number;
}

export interface UpdateChallengeData {
  title?: string;
  description?: string;
  orderIndex?: number;
}

export const challengeRepository = {
  async listBySkill(
    skillId: string,
    { page, limit, sort = 'orderIndex' }: { page: number; limit: number; sort?: string },
  ) {
    const orderBy: Record<string, 'asc' | 'desc'> = {};
    if (sort === 'orderIndex') {
      orderBy.orderIndex = 'asc';
    } else {
      orderBy.createdAt = 'desc';
    }

    const [items, total] = await Promise.all([
      prisma.challenge.findMany({
        where: {
          skillId,
          skill: {
            isActive: true,
          },
        },
        skip: getSkip(page, limit),
        take: limit,
        orderBy,
      }),
      prisma.challenge.count({
        where: {
          skillId,
          skill: {
            isActive: true,
          },
        },
      }),
    ]);

    return { items, total };
  },

  async getById(id: string) {
    return prisma.challenge.findUnique({
      where: { id },
      include: {
        skill: true,
      },
    });
  },

  async create(data: CreateChallengeData) {
    return prisma.challenge.create({
      data: {
        skillId: data.skillId,
        title: data.title,
        description: data.description,
        orderIndex: data.orderIndex,
      },
    });
  },

  async update(id: string, data: UpdateChallengeData) {
    return prisma.challenge.update({
      where: { id },
      data,
    });
  },

  async delete(id: string) {
    return prisma.challenge.delete({
      where: { id },
    });
  },

  async existsOrderIndex(skillId: string, orderIndex: number, excludeId?: string) {
    const where: {
      skillId: string;
      orderIndex: number;
      id?: { not: string };
    } = {
      skillId,
      orderIndex,
    };
    if (excludeId) {
      where.id = { not: excludeId };
    }
    const count = await prisma.challenge.count({ where });
    return count > 0;
  },
};

