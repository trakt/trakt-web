import { z } from 'zod';
import { EpisodeEntrySchema } from './EpisodeEntry.ts';
import { MovieEntrySchema } from './MovieEntry.ts';
import { SeasonSchema } from './Season.ts';
import { ShowEntrySchema } from './ShowEntry.ts';

const BaseListItemSchema = z.object({
  id: z.number(),
  key: z.string(),
  rank: z.number(),
  notes: z.string().nullish(),
  listedAt: z.date(),
});

const ListedMovieSchema = z.object({
  type: z.literal('movie'),
  entry: MovieEntrySchema,
}).merge(BaseListItemSchema);

const ListedShowSchema = z.object({
  type: z.literal('show'),
  entry: ShowEntrySchema,
}).merge(BaseListItemSchema);

const ListedEpisodeSchema = z.object({
  type: z.literal('episode'),
  entry: z.object({
    episode: EpisodeEntrySchema,
    show: ShowEntrySchema,
  }),
}).merge(BaseListItemSchema);

const ListedSeasonSchema = z.object({
  type: z.literal('season'),
  entry: z.object({
    season: SeasonSchema,
    show: ShowEntrySchema,
  }),
}).merge(BaseListItemSchema);

export const ListItemSchema = z.discriminatedUnion('type', [
  ListedMovieSchema,
  ListedShowSchema,
  ListedEpisodeSchema,
  ListedSeasonSchema,
]);

export type ListItem = z.infer<typeof ListItemSchema>;
