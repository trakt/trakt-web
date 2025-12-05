import { UserProfileSchema } from '$lib/requests/models/UserProfile.ts';
import { reactionsSchema } from '@trakt/api';
import { z } from 'zod';

export const MediaCommentSchema = z.object({
  id: z.number(),
  key: z.string(),
  parentId: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
  comment: z.string(),
  isSpoiler: z.boolean(),
  isReview: z.boolean(),
  replyCount: z.number(),
  likeCount: z.number(),
  user: UserProfileSchema.extend({
    stats: z.object({
      rating: z.number().nullish(),
      playCount: z.number(),
      completedCount: z.number(),
    }),
  }),
  reactions: z.object({
    count: z.number(),
    // TODO: non @trakt/api schema
    distribution: z.record(reactionsSchema, z.number()),
  }).optional(),
});

export type MediaComment = z.infer<typeof MediaCommentSchema>;
