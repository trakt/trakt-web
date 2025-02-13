import { EpisodeEntrySchema } from '$lib/requests/models/EpisodeEntry.ts';
import { MovieEntrySchema } from '$lib/requests/models/MovieEntry.ts';
import { ShowEntrySchema } from '$lib/requests/models/ShowEntry.ts';
import { UserProfileSchema } from '$lib/requests/models/UserProfile.ts';
import z from 'zod';

export const SocialActivityMovieSchema = z.object({
  id: z.number(),
  activityAt: z.date(),
  type: z.literal('movie'),
  user: UserProfileSchema,
  movie: MovieEntrySchema,
});

export const SocialActivityEpisodeSchema = z.object({
  id: z.number(),
  activityAt: z.date(),
  type: z.literal('episode'),
  user: UserProfileSchema,
  show: ShowEntrySchema,
  episode: EpisodeEntrySchema,
});

export const SocialActivitySchema = z.discriminatedUnion('type', [
  SocialActivityMovieSchema,
  SocialActivityEpisodeSchema,
]);
export type SocialActivity = z.infer<typeof SocialActivitySchema>;
