import { z } from 'zod';

export const SoundtrackTrackSchema = z.object({
  key: z.string(),
  title: z.string(),
  performer: z.string().nullish(),
  spotifyId: z.string().nullish(),
  matchedOn: z.string().nullish(),
  position: z.number(),
  season: z.number().nullish(),
  source: z.string().nullish(),
});

export type SoundtrackTrack = z.infer<typeof SoundtrackTrackSchema>;
