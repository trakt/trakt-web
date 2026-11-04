import { z } from 'zod';
import { MatchTasteSchema } from './MatchTaste.ts';

export const MatchResponseSchema = z.object({
  match: z.number().int().min(0).max(100).nullable(),
  taste: z.array(MatchTasteSchema).default([]),
});

export type MatchResponse = z.infer<typeof MatchResponseSchema>;
