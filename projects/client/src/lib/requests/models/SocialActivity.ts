import { EpisodeEntrySchema } from '$lib/requests/models/EpisodeEntry.ts';
import { MovieEntrySchema } from '$lib/requests/models/MovieEntry.ts';
import { ShowEntrySchema } from '$lib/requests/models/ShowEntry.ts';
import { UserProfileSchema } from '$lib/requests/models/UserProfile.ts';
import z from 'zod';

export const SocialActivityMovieSchema = z.object({
  key: z.string(),
  activityAt: z.date(),
  type: z.literal('movie'),
  users: z.array(UserProfileSchema),
  movie: MovieEntrySchema,
});

export const SocialActivityEpisodeSchema = z.object({
  key: z.string(),
  activityAt: z.date(),
  type: z.literal('episode'),
  users: z.array(UserProfileSchema),
  episode: EpisodeEntrySchema,
  show: ShowEntrySchema,
});

export const SocialActivitySchema = z.discriminatedUnion('type', [
  SocialActivityMovieSchema,
  SocialActivityEpisodeSchema,
]);
export type EpisodeActivity = z.infer<typeof SocialActivityEpisodeSchema>;
export type SocialActivity = z.infer<typeof SocialActivitySchema>;
