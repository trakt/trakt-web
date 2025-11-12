import { MediaEntrySchema } from '$lib/requests/models/MediaEntry.ts';
import { z } from 'zod';

export const MediaCreditsSchema = z
  .map(
    z.string(),
    z.array(MediaEntrySchema),
  );

export type MediaCredits = z.infer<typeof MediaCreditsSchema>;
