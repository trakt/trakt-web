import { z } from 'zod';

export const OnboardingStepRecordSchema = z.object({
  status: z.enum(['done', 'skipped', 'todo']),
  at: z.number(),
  source: z.enum(['action', 'account']).nullish(),
});

export type OnboardingStepRecord = z.infer<typeof OnboardingStepRecordSchema>;
