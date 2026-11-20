import type { NowPlayingItem } from '$lib/requests/models/NowPlayingItem.ts';
import type { UserProfile } from '$lib/requests/models/UserProfile.ts';
import type { WatchingNowEntry } from '../models/WatchingNowEntry.ts';

type WatchingNowEntriesParams = {
  users: ReadonlyArray<UserProfile>;
  watching: ReadonlyArray<NowPlayingItem | Nil>;
  now: number;
};

export function toWatchingNowEntries({
  users,
  watching,
  now,
}: WatchingNowEntriesParams): ReadonlyArray<WatchingNowEntry> {
  return users
    .flatMap((user, index) => {
      const nowPlaying = watching.at(index);
      if (!nowPlaying) return [];
      if (nowPlaying.expiresAt.getTime() <= now) return [];

      return [{ key: user.key, user, nowPlaying }];
    })
    .toSorted(
      (a, b) =>
        b.nowPlaying.startedAt.getTime() - a.nowPlaying.startedAt.getTime(),
    );
}
