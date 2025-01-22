import type { z } from 'zod';
import { MediaEntrySchema } from './MediaEntry.ts';

export const MovieEntrySchema = MediaEntrySchema;
export type MovieEntry = z.infer<typeof MovieEntrySchema>;
