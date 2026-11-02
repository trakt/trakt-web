import { z } from 'zod';

export const MirShareItemSchema = z.object({
  key: z.string(),
  title: z.string(),
  year: z.number().nullish(),
  posterUrl: z.string(),
  plays: z.number(),
  minutes: z.number(),
});

export type MirShareItem = z.infer<typeof MirShareItemSchema>;
