import { z } from 'zod';

export const MediaVideoType = z.enum([
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
  type: MediaVideoType,
  url: z.string().url(),
  thumbnail: z.string().url(),
  title: z.string(),
  publishedAt: z.date(),
});
export type MediaVideo = z.infer<typeof MediaVideoSchema>;
