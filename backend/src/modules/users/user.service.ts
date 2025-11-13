import { userRepository } from './user.repository';
import { NotFoundError, ForbiddenError, ConflictError } from '../../lib/errors';
import type { CreateUserDTO, UpdateUserDTO } from './user.dto';

export const userService = {
  async list({ page, limit, search, isActive }: { page: number; limit: number; search?: string; isActive?: boolean }) {
    return userRepository.list({ page, limit, search, isActive });
  },

  async getById(id: string, requesterId: string, requesterRole: string) {
    if (requesterRole !== 'admin' && requesterId !== id) {
      throw new ForbiddenError('Forbidden');
    }

    const user = await userRepository.getById(id);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    return user;
  },

  async create(data: CreateUserDTO) {
    const exists = await userRepository.existsByEmail(data.email);
    if (exists) {
      throw new ConflictError('User with this email already exists');
    }

    return userRepository.create(data);
  },

  async update(id: string, data: UpdateUserDTO) {
    const user = await userRepository.getById(id);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    if (data.email && data.email !== user.email) {
      const exists = await userRepository.existsByEmail(data.email, id);
      if (exists) {
        throw new ConflictError('User with this email already exists');
      }
    }

    return userRepository.update(id, data);
  },
};

