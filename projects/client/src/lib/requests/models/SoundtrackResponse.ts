import { z } from 'zod';

export const SoundtrackResponseSchema = z.array(
  z.object({
    title: z.string(),
    performer: z.string().nullish(),
    spotify_id: z.string().nullish(),
    // Not an enum on purpose: the matcher gains tiers, and an unrecognised
    // one would fail the whole array, costing the reader the tracklist.
    matched_on: z.string().nullish(),
    position: z.number(),
  }),
);

export type SoundtrackResponse = z.infer<typeof SoundtrackResponseSchema>;
