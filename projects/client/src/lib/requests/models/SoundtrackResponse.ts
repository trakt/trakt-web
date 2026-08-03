import { z } from 'zod';

export const SoundtrackResponseSchema = z.array(
  z.object({
    title: z.string(),
    performer: z.string().nullish(),
    spotify_id: z.string().nullish(),
    // Records which rewording produced the match. Kept out of the UI; it
    // travels with the play event so we can measure match quality.
    matched_on: z.enum(['credit', 'title', 'artist', 'both']).nullish(),
    position: z.number(),
  }),
);

export type SoundtrackResponse = z.infer<typeof SoundtrackResponseSchema>;
