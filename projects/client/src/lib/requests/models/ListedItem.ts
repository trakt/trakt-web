import { ListItemSchemaFactory } from '$lib/requests/models/ListItem.ts';
import { MovieEntrySchema } from '$lib/requests/models/MovieEntry.ts';
import { ShowEntrySchema } from '$lib/requests/models/ShowEntry.ts';
import { z } from 'zod';

export const ListedItemSchema = ListItemSchemaFactory(
  z.union([MovieEntrySchema, ShowEntrySchema]),
);

export type ListedItem = z.infer<typeof ListedItemSchema>;
