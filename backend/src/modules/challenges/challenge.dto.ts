import { z } from 'zod';

export const createChallengeSchema = z.object({
  title: z.string().min(2).max(120),
  description: z.string().max(1000),
  orderIndex: z.number().int().min(1),
});

export type CreateChallengeDTO = z.infer<typeof createChallengeSchema>;

export const updateChallengeSchema = z.object({
  title: z.string().min(2).max(120).optional(),
  description: z.string().max(1000).optional(),
  orderIndex: z.number().int().min(1).optional(),
});

export type UpdateChallengeDTO = z.infer<typeof updateChallengeSchema>;

export const listChallengesQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  sort: z.string().optional().default('orderIndex'),
});

export type ListChallengesQuery = z.infer<typeof listChallengesQuerySchema>;

