import { z } from 'zod';
import { NowPlayingItemSchema } from './NowPlayingItem.ts';
import { UserProfileSchema } from './UserProfile.ts';

export const FollowingWatchingSchema = z.object({
  user: UserProfileSchema,
  nowPlaying: NowPlayingItemSchema,
});

export type FollowingWatching = z.infer<typeof FollowingWatchingSchema>;
