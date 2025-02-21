import { UserProfileSchema } from '$lib/requests/models/UserProfile.ts';
import { z } from 'zod';

export const MediaListSummarySchema = z.object({
  id: z.number(),
  slug: z.string(),
  name: z.string(),
  description: z.string(),
  user: UserProfileSchema,
  count: z.number(),
});

export type MediaListSummary = z.infer<typeof MediaListSummarySchema>;
