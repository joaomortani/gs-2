import { challengeRepository } from './challenge.repository';
import { CreateChallengeDTO, UpdateChallengeDTO } from './challenge.dto';
import { trimString, validateTitle, validateDescription, validateOrderIndex } from '../../lib/validation';
import { NotFoundError, ConflictError } from '../../lib/errors';
import { prisma } from '../../config/prisma';

export const challengeService = {
  async listBySkill(skillId: string, { page, limit, sort }: { page: number; limit: number; sort?: string }) {
    const skill = await prisma.skill.findUnique({
      where: { id: skillId },
    });

    if (!skill) {
      throw new NotFoundError('Skill not found');
    }

    const result = await challengeRepository.listBySkill(skillId, { page, limit, sort });
    return result;
  },

  async getById(id: string) {
    const challenge = await challengeRepository.getById(id);
    if (!challenge) {
      throw new NotFoundError('Challenge not found');
    }
    return challenge;
  },

  async create(skillId: string, data: CreateChallengeDTO) {
    const skill = await prisma.skill.findUnique({
      where: { id: skillId },
    });

    if (!skill) {
      throw new NotFoundError('Skill not found');
    }

    if (!skill.isActive) {
      throw new NotFoundError('Skill is not active');
    }

    const title = trimString(data.title);
    const description = trimString(data.description);

    validateTitle(title);
    validateDescription(description);
    validateOrderIndex(data.orderIndex);

    const exists = await challengeRepository.existsOrderIndex(skillId, data.orderIndex);
    if (exists) {
      throw new ConflictError('Challenge with this orderIndex already exists for this skill');
    }

    return challengeRepository.create({
      skillId,
      title,
      description,
      orderIndex: data.orderIndex,
    });
  },

  async update(id: string, data: UpdateChallengeDTO) {
    const challenge = await challengeRepository.getById(id);
    if (!challenge) {
      throw new NotFoundError('Challenge not found');
    }

    const updateData: { title?: string; description?: string; orderIndex?: number } = {};

    if (data.title !== undefined) {
      const title = trimString(data.title);
      validateTitle(title);
      updateData.title = title;
    }

    if (data.description !== undefined) {
      const description = trimString(data.description);
      validateDescription(description);
      updateData.description = description;
    }

    if (data.orderIndex !== undefined) {
      validateOrderIndex(data.orderIndex);
      const exists = await challengeRepository.existsOrderIndex(challenge.skillId, data.orderIndex, id);
      if (exists) {
        throw new ConflictError('Challenge with this orderIndex already exists for this skill');
      }
      updateData.orderIndex = data.orderIndex;
    }

    return challengeRepository.update(id, updateData);
  },

  async delete(id: string) {
    const challenge = await challengeRepository.getById(id);
    if (!challenge) {
      throw new NotFoundError('Challenge not found');
    }

    return challengeRepository.delete(id);
  },
};

