import type { NowPlayingItem } from '$lib/requests/models/NowPlayingItem.ts';
import type { UserProfile } from '$lib/requests/models/UserProfile.ts';

type WatchingNowUser = Pick<
  UserProfile,
  'key' | 'username' | 'name' | 'avatar' | 'isVip' | 'slug'
> &
  Partial<Pick<UserProfile, 'veteran' | 'isDirector'>>;

export type WatchingNowEntry = {
  key: string;
  user: WatchingNowUser;
  nowPlaying: NowPlayingItem;
};
