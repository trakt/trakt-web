import { z } from 'zod';
import { EpisodeEntrySchema } from './EpisodeEntry.ts';
import { MediaEntrySchema } from './MediaEntry.ts';

const NowPlayingBaseSchema = z.object({
  media: MediaEntrySchema,
  startedAt: z.date(),
  expiresAt: z.date(),
});

const NowPlayingEpisodeSchema = NowPlayingBaseSchema.extend({
  type: z.literal('episode'),
  episode: EpisodeEntrySchema,
});

const NowPlayingMovieSchema = NowPlayingBaseSchema.extend({
  type: z.literal('movie'),
});

export const NowPlayingItemSchema = z.discriminatedUnion('type', [
  NowPlayingEpisodeSchema,
  NowPlayingMovieSchema,
]);

export type NowPlayingItem = z.infer<typeof NowPlayingItemSchema>;
