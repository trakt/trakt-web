import { z } from 'zod';

export const MediaListSummarySchema = z.object({
  id: z.number(),
  slug: z.string(),
  name: z.string(),
  description: z.string(),
  user: z.object({
    userName: z.string(),
    isVip: z.boolean(),
    slug: z.string(),
    avatar: z.object({
      url: z.string(),
    }),
  }),
});

export type MediaListSummary = z.infer<typeof MediaListSummarySchema>;
