import { UserProfileSchema } from '$lib/requests/models/UserProfile.ts';
import { z } from 'zod';

const MediaSocialRatingSchema = z.object({
  rating: z.number(),
  ratedAt: z.date().nullish(),
});

const MediaSocialCommentSchema = z.object({
  id: z.number(),
  key: z.string(),
  comment: z.string(),
  isSpoiler: z.boolean(),
  isReview: z.boolean(),
  createdAt: z.date().nullish(),
  updatedAt: z.date().nullish(),
});

const MediaSocialWatchedSchema = z.object({
  plays: z.number(),
  minutesWatched: z.number().nullish(),
  lastWatchedAt: z.date().nullish(),
  lastUpdatedAt: z.date().nullish(),
  rating: MediaSocialRatingSchema.optional(),
  comment: MediaSocialCommentSchema.optional(),
});

const MediaSocialWatchlistedSchema = z.object({
  listedAt: z.date(),
});

export const MediaSocialSchema = z.object({
  key: z.string(),
  followedAt: z.date(),
  user: UserProfileSchema,
  watched: MediaSocialWatchedSchema.optional(),
  watchlisted: MediaSocialWatchlistedSchema.optional(),
});

export type MediaSocial = z.infer<typeof MediaSocialSchema>;
