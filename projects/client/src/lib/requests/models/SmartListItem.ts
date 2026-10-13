import { z } from 'zod';
import { MovieEntrySchema } from './MovieEntry.ts';
import { ShowEntrySchema } from './ShowEntry.ts';

export const SmartListItemSchema = z.union([ShowEntrySchema, MovieEntrySchema]);

export type SmartListItem = z.infer<typeof SmartListItemSchema>;
