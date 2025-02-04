import { z } from 'zod';

export const MediaCommentSchema = z.object({
  id: z.number(),
  parentId: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
  comment: z.string(),
  isSpoiler: z.boolean(),
  isReview: z.boolean(),
  replyCount: z.number(),
  likeCount: z.number(),
  user: z.object({
    userName: z.string(),
    isVip: z.boolean(),
    slug: z.string(),
    avatar: z.object({
      url: z.string(),
    }),
    stats: z.object({
      rating: z.number().nullable(),
      playCount: z.number(),
      completedCount: z.number(),
    }),
  }),
});

export type MediaComment = z.infer<typeof MediaCommentSchema>;
