import { UserProfileSchema } from '$lib/requests/models/UserProfile.ts';
import { z } from 'zod';

export const RecommendedBySchema = z.object({
  users: z.array(UserProfileSchema),
  otherCount: z.number(),
});

export type RecommendedBy = z.infer<typeof RecommendedBySchema>;
