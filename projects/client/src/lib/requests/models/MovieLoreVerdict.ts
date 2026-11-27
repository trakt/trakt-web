import { z } from 'zod';

export const MovieLoreVerdictSchema = z.enum([
  'required',
  'helpful',
  'not_needed',
]);

export type MovieLoreVerdict = z.infer<typeof MovieLoreVerdictSchema>;
