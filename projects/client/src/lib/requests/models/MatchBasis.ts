import { z } from 'zod';

export const MatchBasisSchema = z.enum(['taste', 'series']);

export type MatchBasis = z.infer<typeof MatchBasisSchema>;
