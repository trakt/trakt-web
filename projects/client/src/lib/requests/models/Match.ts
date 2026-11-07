import { z } from 'zod';
import { MatchKindSchema } from './MatchKind.ts';
import { MatchScoreSchema } from './MatchScore.ts';
import { MatchTasteSchema } from './MatchTaste.ts';

export const MatchSchema = z.object({
  kind: MatchKindSchema,
  score: MatchScoreSchema,
  taste: z.array(MatchTasteSchema),
});

export type Match = z.infer<typeof MatchSchema>;
