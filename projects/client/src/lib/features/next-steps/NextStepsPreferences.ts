import { z } from 'zod';
import { NextStepId } from './NextStepId.ts';

export const NextStepsPreferencesSchema = z.object({
  isDismissed: z.boolean(),
  skipped: z.array(z.nativeEnum(NextStepId)),
});

export type NextStepsPreferences = z.infer<typeof NextStepsPreferencesSchema>;
