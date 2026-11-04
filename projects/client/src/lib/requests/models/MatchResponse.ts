import { z } from 'zod';

export const MatchResponseSchema = z.object({
  match: z.number().int().min(0).max(100).nullable(),
});

export type MatchResponse = z.infer<typeof MatchResponseSchema>;
