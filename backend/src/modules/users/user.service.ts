import { userRepository } from './user.repository';
import { NotFoundError, ForbiddenError } from '../../lib/errors';

export const userService = {
  async list({ page, limit, search }: { page: number; limit: number; search?: string }) {
    return userRepository.list({ page, limit, search });
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
};

