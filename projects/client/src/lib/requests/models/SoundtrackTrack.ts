import { z } from 'zod';

export const SoundtrackTrackSchema = z.object({
  key: z.string(),
  title: z.string(),
  performer: z.string().nullish(),
  spotifyId: z.string().nullish(),
  matchedOn: z.enum(['credit', 'title', 'artist', 'both']).nullish(),
  position: z.number(),
});

export type SoundtrackTrack = z.infer<typeof SoundtrackTrackSchema>;
