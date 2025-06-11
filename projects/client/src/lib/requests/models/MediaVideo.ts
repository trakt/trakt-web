import { z } from 'zod';

export const MediaVideoTypeSchema = z.enum([
  'trailer',
  'clip',
  'teaser',
  'featurette',
  'recap',
  'behind the scenes',
  'opening credits',
]);

export const MediaVideoSchema = z.object({
  id: z.string(),
  type: MediaVideoTypeSchema,
  url: z.string().url(),
  thumbnail: z.string().url(),
  title: z.string(),
  publishedAt: z.date(),
});

export type MediaVideoType = z.infer<typeof MediaVideoTypeSchema>;
export type MediaVideo = z.infer<typeof MediaVideoSchema>;
