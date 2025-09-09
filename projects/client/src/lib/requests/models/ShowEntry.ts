import type z from 'zod';
import { EpisodeCountSchema } from './EpisodeCount.ts';
import { MediaEntrySchema } from './MediaEntry.ts';

export const ShowEntrySchema = MediaEntrySchema.merge(EpisodeCountSchema);
export type ShowEntry = z.infer<typeof ShowEntrySchema>;
