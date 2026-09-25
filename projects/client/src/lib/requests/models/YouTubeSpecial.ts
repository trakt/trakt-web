import { z } from 'zod';
import { HttpsUrlSchema } from './HttpsUrlSchema.ts';

export const YouTubeSpecialSchema = z.object({
  videoId: z.string(),
  title: z.string(),
  channel: z.string(),
  durationSeconds: z.number().nullish(),
  source: z.enum(['official', 'unofficial']),
  link: HttpsUrlSchema,
});

export type YouTubeSpecial = z.infer<typeof YouTubeSpecialSchema>;
