import { z } from 'zod';
import { EpisodeEntrySchema } from './EpisodeEntry.ts';
import { MovieEntrySchema } from './MovieEntry.ts';
import { ShowEntrySchema } from './ShowEntry.ts';

const NowPlayingActionSchema = z.enum([
  'checkin',
  'scrobble',
]);

const NowPlayingBaseSchema = z.object({
  startedAt: z.date(),
  expiresAt: z.date(),
  action: NowPlayingActionSchema,
});

const NowPlayingEpisodeSchema = NowPlayingBaseSchema.extend({
  type: z.literal('episode'),
  episode: EpisodeEntrySchema,
  media: ShowEntrySchema,
});

const NowPlayingMovieSchema = NowPlayingBaseSchema.extend({
  type: z.literal('movie'),
  media: MovieEntrySchema,
});

export const NowPlayingItemSchema = z.discriminatedUnion('type', [
  NowPlayingEpisodeSchema,
  NowPlayingMovieSchema,
]);

export type NowPlayingAction = z.infer<typeof NowPlayingActionSchema>;
export type NowPlayingItem = z.infer<typeof NowPlayingItemSchema>;
