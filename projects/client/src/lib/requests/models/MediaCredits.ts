import { MediaEntrySchema } from '$lib/requests/models/MediaEntry.ts';
import { crewPositionSchema } from '@trakt/api';
import { z } from 'zod';

export const MediaCreditsSchema = z.object({
  cast: z
    .array(MediaEntrySchema),
  crew: z
    .map(
      crewPositionSchema,
      z.array(MediaEntrySchema),
    ),
});

export type MediaCredits = z.infer<typeof MediaCreditsSchema>;
