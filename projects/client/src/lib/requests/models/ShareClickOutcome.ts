import { z } from 'zod';

export const ShareClickOutcomeSchema = z.enum([
  'recorded',
  'duplicate',
  'rejected',
]);

export type ShareClickOutcome = z.infer<typeof ShareClickOutcomeSchema>;
