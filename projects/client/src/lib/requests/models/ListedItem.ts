import { EpisodeCountSchema } from '$lib/requests/models/EpisodeCount.ts';
import { ListItemSchemaFactory } from '$lib/requests/models/ListItem.ts';
import { MovieEntrySchema } from '$lib/requests/models/MovieEntry.ts';
import { ShowEntrySchema } from '$lib/requests/models/ShowEntry.ts';
import { z } from 'zod';

const ListedShowEntrySchema = ShowEntrySchema.merge(
  EpisodeCountSchema,
);

export const ListedItemSchema = ListItemSchemaFactory(
  z.union([MovieEntrySchema, ListedShowEntrySchema]),
);

export type ListedItem = z.infer<typeof ListedItemSchema>;
