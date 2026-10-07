import { z } from 'zod';
import { EpisodeEntrySchema } from './EpisodeEntry.ts';
import { MovieEntrySchema } from './MovieEntry.ts';
import { SeasonSchema } from './Season.ts';
import { ShowEntrySchema } from './ShowEntry.ts';
import { UserProfileSchema } from './UserProfile.ts';

const FollowingActivityTargetSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('movie'), movie: MovieEntrySchema }),
  z.object({ type: z.literal('show'), show: ShowEntrySchema }),
  z.object({
    type: z.literal('season'),
    show: ShowEntrySchema,
    season: SeasonSchema,
  }),
  z.object({
    type: z.literal('episode'),
    show: ShowEntrySchema,
    episode: EpisodeEntrySchema,
  }),
]);

const FollowingActivityCommentSchema = z.object({
  id: z.number(),
  text: z.string(),
  gif: z.object({
    url: z.string(),
  }).nullish(),
  isSpoiler: z.boolean(),
  isReview: z.boolean(),
  likeCount: z.number(),
  replyCount: z.number(),
});

const FollowingActivityDetailSchema = z.discriminatedUnion('action', [
  z.object({ action: z.literal('watch') }),
  z.object({ action: z.literal('rating'), rating: z.number() }),
  z.object({
    action: z.literal('comment'),
    comment: FollowingActivityCommentSchema,
  }),
]);

export const FollowingActivitySchema = z.object({
  key: z.string(),
  activityAt: z.date(),
  user: UserProfileSchema,
  target: FollowingActivityTargetSchema,
  detail: FollowingActivityDetailSchema,
});

export type FollowingActivity = z.infer<typeof FollowingActivitySchema>;
