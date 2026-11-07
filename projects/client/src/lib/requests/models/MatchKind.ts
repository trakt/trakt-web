import { z } from 'zod';

export const MatchKindSchema = z.enum(['match', 'hype']);

export type MatchKind = z.infer<typeof MatchKindSchema>;
