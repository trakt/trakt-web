import { z } from 'zod';
import { EpisodeEntrySchema } from './EpisodeEntry.ts';
import { MediaEntrySchema } from './MediaEntry.ts';

const NowPlayingActionSchema = z.enum([
  'checkin',
  'scrobble',
]);

const NowPlayingBaseSchema = z.object({
  media: MediaEntrySchema,
  startedAt: z.date(),
  expiresAt: z.date(),
  action: NowPlayingActionSchema,
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

export type NowPlayingAction = z.infer<typeof NowPlayingActionSchema>;
export type NowPlayingItem = z.infer<typeof NowPlayingItemSchema>;
