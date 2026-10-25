import { UserProfileSchema } from '$lib/requests/models/UserProfile.ts';
import { z } from 'zod';
import { ImageUrlsSchema } from './ImageUrlsSchema.ts';
import { ListPrivacySchema } from './ListPrivacy.ts';
import { ListTypeSchema } from './ListType.ts';

export const MediaListSummarySchema = z.object({
  id: z.number(),
  key: z.string(),
  slug: z.string(),
  name: z.string(),
  description: z.string(),
  user: UserProfileSchema,
  count: z.number(),
  likeCount: z.number(),
  posters: z.array(
    z.object({
      url: ImageUrlsSchema,
    }),
  ),
  createdAt: z.date(),
  updatedAt: z.date(),
  sortHow: z.enum(['asc', 'desc']),
  sortBy: z.string(),
  type: ListTypeSchema,
  privacy: ListPrivacySchema,
  staleOrigin: z
    .object({
      name: z.string(),
      url: z.string().nullable(),
    })
    .nullable(),
  convertedTo: z.object({ slug: z.string() }).nullable(),
});

export type MediaListSummary = z.infer<typeof MediaListSummarySchema>;
