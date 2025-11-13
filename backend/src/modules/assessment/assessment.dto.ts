import { z } from 'zod';

export const submitAssessmentSchema = z.object({
  skillId: z.string().min(1),
  score: z.number().int().min(1).max(10),
});

export type SubmitAssessmentDTO = z.infer<typeof submitAssessmentSchema>;

export const submitAssessmentsSchema = z.object({
  assessments: z.array(submitAssessmentSchema).min(1),
});

export type SubmitAssessmentsDTO = z.infer<typeof submitAssessmentsSchema>;

