import { z } from 'zod';

export const StreamingSourceTypeSchema = z.enum([
  'free',
  'tv_everywhere',
  'subscription',
  'purchase',
  'cinema',
]);

export type StreamingSourceType = z.infer<typeof StreamingSourceTypeSchema>;
