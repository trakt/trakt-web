import { z } from 'zod';
import { OnboardingStepRecordSchema } from './OnboardingStepRecord.ts';

export const OnboardingSetRecordSchema = z.object({
  startedAt: z.number(),
  completedAt: z.number().nullish(),
  retiredAt: z.number().nullish(),
  tracked: z
    .object({
      stepId: z.string().nullish(),
      at: z.number(),
    })
    .nullish(),
  steps: z.record(z.string(), OnboardingStepRecordSchema),
});

export type OnboardingSetRecord = z.infer<typeof OnboardingSetRecordSchema>;
