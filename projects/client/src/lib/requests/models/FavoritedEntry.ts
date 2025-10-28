import { z } from 'zod';
import { MovieEntrySchema } from './MovieEntry.ts';
import { ShowEntrySchema } from './ShowEntry.ts';

export const FavoritedEntrySchema = z.object({
  favoritedAt: z.coerce.date(),
  rank: z.number(),
  key: z.string(),
  item: z.union([MovieEntrySchema, ShowEntrySchema]),
});
export type FavoritedEntry = z.infer<typeof FavoritedEntrySchema>;
