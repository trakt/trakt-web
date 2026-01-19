import { z } from 'zod';
import { MovieEntrySchema } from './MovieEntry.ts';
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

export const ListItemSchema = z.discriminatedUnion('type', [
  ListedMovieSchema,
  ListedShowSchema,
]);

export type ListItem = z.infer<typeof ListItemSchema>;
