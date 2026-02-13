import { UserProfileSchema } from '$lib/requests/models/UserProfile.ts';
import { z } from 'zod';
import { ImageUrlsSchema } from './ImageUrlsSchema.ts';
import { ListTypeSchema } from './ListType.ts';

export const MediaListSummarySchema = z.object({
  id: z.number(),
  key: z.string(),
  slug: z.string(),
  name: z.string(),
  description: z.string(),
  user: UserProfileSchema,
  count: z.number(),
  posters: z.array(z.object({
    url: ImageUrlsSchema,
  })),
  updatedAt: z.date(),
  sortHow: z.enum(['asc', 'desc']),
  sortBy: z.string(),
  type: ListTypeSchema,
});

export type MediaListSummary = z.infer<typeof MediaListSummarySchema>;
