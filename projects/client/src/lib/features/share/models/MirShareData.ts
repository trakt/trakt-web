import { MediaEntrySchema } from '$lib/requests/models/MediaEntry.ts';
import { z } from 'zod';
import { MirShareItemSchema } from './MirShareItem.ts';
import { ShareUserSchema } from './ShareUser.ts';

const MirShareHighlightSchema = z.object({
  key: z.string(),
  title: z.string(),
  posterUrl: z.string(),
});

export const MirShareDataSchema = z.object({
  year: z.number(),
  month: z.number(),
  user: ShareUserSchema,
  colors: MediaEntrySchema.shape.colors,
  totals: z.object({
    plays: z.number(),
    minutes: z.number(),
    episodes: z.number(),
    movies: z.number(),
  }),
  firstWatched: MirShareHighlightSchema.nullish(),
  lastWatched: MirShareHighlightSchema.nullish(),
  shows: MirShareItemSchema.array(),
  movies: MirShareItemSchema.array(),
});

export type MirShareData = z.infer<typeof MirShareDataSchema>;
