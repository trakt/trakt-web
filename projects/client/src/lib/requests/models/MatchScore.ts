import { z } from 'zod';

export const MatchScoreSchema = z.number().int().min(0).max(100).nullable();

export type MatchScore = z.infer<typeof MatchScoreSchema>;
