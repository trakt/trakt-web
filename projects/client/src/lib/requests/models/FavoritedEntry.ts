import { z } from 'zod';
import { EpisodeCountSchema } from './EpisodeCount.ts';
import { MovieEntrySchema } from './MovieEntry.ts';
import { ShowEntrySchema } from './ShowEntry.ts';

const FavoritedShowEntrySchema = ShowEntrySchema.merge(
  EpisodeCountSchema,
);

export const FavoritedEntrySchema = z.object({
  favoritedAt: z.coerce.date(),
  rank: z.number(),
  id: z.number(),
  item: z.union([MovieEntrySchema, FavoritedShowEntrySchema]),
});
export type FavoritedEntry = z.infer<typeof FavoritedEntrySchema>;
