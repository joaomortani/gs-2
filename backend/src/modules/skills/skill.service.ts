import { skillRepository } from './skill.repository';
import { CreateSkillDTO, UpdateSkillDTO } from './skill.dto';
import { trimString, validateName, validateDescription } from '../../lib/validation';
import { NotFoundError, ConflictError } from '../../lib/errors';

export const skillService = {
  async list({ isActive, page, limit }: { isActive?: boolean; page: number; limit: number }) {
    const result = await skillRepository.list({ isActive, page, limit });
    return result;
  },

  async getById(id: string) {
    const skill = await skillRepository.getById(id);
    if (!skill) {
      throw new NotFoundError('Skill not found');
    }
    return skill;
  },

  async create(data: CreateSkillDTO) {
    const name = trimString(data.name);
    const description = trimString(data.description);

    validateName(name);
    validateDescription(description);

    const exists = await skillRepository.existsByName(name);
    if (exists) {
      throw new ConflictError('Skill with this name already exists');
    }

    return skillRepository.create({
      name,
      description,
      isActive: data.isActive,
    });
  },

  async update(id: string, data: UpdateSkillDTO) {
    const skill = await skillRepository.getById(id);
    if (!skill) {
      throw new NotFoundError('Skill not found');
    }

    const updateData: { name?: string; description?: string; isActive?: boolean } = {};

    if (data.name !== undefined) {
      const name = trimString(data.name);
      validateName(name);
      const exists = await skillRepository.existsByName(name, id);
      if (exists) {
        throw new ConflictError('Skill with this name already exists');
      }
      updateData.name = name;
    }

    if (data.description !== undefined) {
      const description = trimString(data.description);
      validateDescription(description);
      updateData.description = description;
    }

    if (data.isActive !== undefined) {
      updateData.isActive = data.isActive;
    }

    return skillRepository.update(id, updateData);
  },

  async softDelete(id: string) {
    const skill = await skillRepository.getById(id);
    if (!skill) {
      throw new NotFoundError('Skill not found');
    }

    return skillRepository.softDelete(id);
  },
};

