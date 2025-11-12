import { z } from 'zod';

export const completeChallengeSchema = z.object({
  status: z.string().optional().default('done'),
});

export type CompleteChallengeDTO = z.infer<typeof completeChallengeSchema>;

export const listHistoryQuerySchema = z.object({
  limit: z.string().optional(),
});

export type ListHistoryQuery = z.infer<typeof listHistoryQuerySchema>;

