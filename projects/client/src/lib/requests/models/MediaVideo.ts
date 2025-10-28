import { videoTypeSchema } from '@trakt/api';
import { z } from 'zod';

export const MediaVideoSchema = z.object({
  key: z.string(),
  type: videoTypeSchema,
  url: z.string().url(),
  thumbnail: z.string().url(),
  title: z.string(),
  publishedAt: z.date(),
});

export type MediaVideoType = z.infer<typeof videoTypeSchema>;
export type MediaVideo = z.infer<typeof MediaVideoSchema>;
