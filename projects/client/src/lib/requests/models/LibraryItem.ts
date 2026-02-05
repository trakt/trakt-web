import z from 'zod';
import { EpisodeEntrySchema } from './EpisodeEntry.ts';
import { MovieEntrySchema } from './MovieEntry.ts';
import { ShowEntrySchema } from './ShowEntry.ts';

const LibraryItemCommonSchema = z.object({
  addedAt: z.date(),
  availableOn: z.array(z.string()),
  key: z.string(),
});

const LibraryMovieSchema = LibraryItemCommonSchema.extend({
  type: z.literal('movie'),
  media: MovieEntrySchema,
});

const LibraryEpisodeSchema = LibraryItemCommonSchema.extend({
  type: z.literal('episode'),
  media: ShowEntrySchema,
  episode: EpisodeEntrySchema,
});

export const LibraryItemSchema = z.discriminatedUnion('type', [
  LibraryMovieSchema,
  LibraryEpisodeSchema,
]);

export type LibraryItem = z.infer<typeof LibraryItemSchema>;
