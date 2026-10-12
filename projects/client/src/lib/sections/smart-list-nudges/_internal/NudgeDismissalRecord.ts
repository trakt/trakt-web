import { z } from 'zod';

export const NudgeDismissalRecordSchema = z.object({
  dismissedAt: z.number(),
  count: z.number(),
});

export type NudgeDismissalRecord = z.infer<typeof NudgeDismissalRecordSchema>;
