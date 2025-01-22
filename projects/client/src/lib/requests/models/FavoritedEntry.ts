import { z } from 'zod';
import { MediaEntrySchema } from './MediaEntry';

export const FavoritedEntrySchema = z.object({
  favoritedAt: z.coerce.date(),
  id: z.number(),
  item: MediaEntrySchema,
});
export type FavoritedEntry = z.infer<typeof FavoritedEntrySchema>;
