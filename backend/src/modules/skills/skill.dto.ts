import { z } from 'zod';

export const createSkillSchema = z.object({
  name: z.string().min(2).max(80),
  description: z.string().max(1000),
  isActive: z.boolean().optional().default(true),
});

export type CreateSkillDTO = z.infer<typeof createSkillSchema>;

export const updateSkillSchema = z.object({
  name: z.string().min(2).max(80).optional(),
  description: z.string().max(1000).optional(),
  isActive: z.boolean().optional(),
});

export type UpdateSkillDTO = z.infer<typeof updateSkillSchema>;

export const listSkillsQuerySchema = z.object({
  isActive: z.string().optional(),
  page: z.string().optional(),
  limit: z.string().optional(),
});

export type ListSkillsQuery = z.infer<typeof listSkillsQuerySchema>;

