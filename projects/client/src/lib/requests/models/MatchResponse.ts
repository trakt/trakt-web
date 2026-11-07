import { z } from 'zod';
import { HypeReasonsSchema } from './HypeReasons.ts';
import { MatchBasisSchema } from './MatchBasis.ts';
import { MatchKindSchema } from './MatchKind.ts';
import { MatchTasteSchema } from './MatchTaste.ts';

export const MatchResponseSchema = z.object({
  kind: MatchKindSchema.nullish(),
  basis: MatchBasisSchema.nullish(),
  reasons: HypeReasonsSchema.nullish(),
  match: z.number().int().min(0).max(100).nullable(),
  taste: z.array(MatchTasteSchema).default([]),
});

export type MatchResponse = z.infer<typeof MatchResponseSchema>;
