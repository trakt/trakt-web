import { z } from 'zod';
import { MatchScoreSchema } from './MatchScore.ts';
import { MatchTasteSchema } from './MatchTaste.ts';

export const MatchSchema = z.object({
  score: MatchScoreSchema,
  taste: z.array(MatchTasteSchema),
});

export type Match = z.infer<typeof MatchSchema>;
