import { z } from 'zod';
import { HypeReasonsSchema } from './HypeReasons.ts';
import { MatchBasisSchema } from './MatchBasis.ts';
import { MatchKindSchema } from './MatchKind.ts';
import { MatchScoreSchema } from './MatchScore.ts';
import { MatchTasteSchema } from './MatchTaste.ts';

export const MatchSchema = z.object({
  kind: MatchKindSchema,
  basis: MatchBasisSchema,
  reasons: HypeReasonsSchema.nullable(),
  score: MatchScoreSchema,
  taste: z.array(MatchTasteSchema),
});

export type Match = z.infer<typeof MatchSchema>;
