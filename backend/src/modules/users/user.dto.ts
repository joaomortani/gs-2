import { z } from 'zod';

export const listUsersQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  search: z.string().optional(),
  isActive: z.string().optional(),
});

export type ListUsersQuery = z.infer<typeof listUsersQuerySchema>;

export const createUserSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name is too long'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['user', 'admin']).default('user'),
  isActive: z.boolean().default(true),
});

export type CreateUserDTO = z.infer<typeof createUserSchema>;

export const updateUserSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name is too long').optional(),
  email: z.string().email('Invalid email format').optional(),
  role: z.enum(['user', 'admin']).optional(),
  isActive: z.boolean().optional(),
});

export type UpdateUserDTO = z.infer<typeof updateUserSchema>;

