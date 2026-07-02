import { z } from 'zod';

export const DirectCommentTargetSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('movie'),
    slug: z.string(),
  }),
  z.object({
    type: z.literal('show'),
    slug: z.string(),
  }),
  z.object({
    type: z.literal('season'),
    slug: z.string(),
    season: z.number(),
  }),
  z.object({
    type: z.literal('episode'),
    slug: z.string(),
    season: z.number(),
    episode: z.number(),
  }),
  z.object({
    type: z.literal('list'),
    user: z.string(),
    list: z.string(),
  }),
]);

export type DirectCommentTarget = z.infer<typeof DirectCommentTargetSchema>;
