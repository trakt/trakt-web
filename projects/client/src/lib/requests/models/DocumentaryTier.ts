import { z } from 'zod';

export const DocumentaryTierSchema = z.enum([
  'none',
  'minor',
  'central',
  'wide',
  'not_enough',
]);

export type DocumentaryTier = z.infer<typeof DocumentaryTierSchema>;
