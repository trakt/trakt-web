import { z } from 'zod';

export const YouTubeSpecialResponseSchema = z.object({
  videoId: z.string(),
  title: z.string(),
  channel: z.string(),
  durationSeconds: z.number().nullish(),
  source: z.enum(['official', 'unofficial']).nullish(),
});

export type YouTubeSpecialResponse = z.infer<
  typeof YouTubeSpecialResponseSchema
>;
