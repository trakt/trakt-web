import { UserProfileSchema } from '$lib/requests/models/UserProfile.ts';
import { z } from 'zod';

export const LeaderboardEntrySchema = z.object({
  key: z.string(),
  rank: z.number().nullable(),
  user: UserProfileSchema,
  totalMinutes: z.number().nullable(),
  totalPlays: z.number().nullable(),
  locked: z.boolean(),
  isViewer: z.boolean(),
});

export type LeaderboardEntry = z.infer<typeof LeaderboardEntrySchema>;
