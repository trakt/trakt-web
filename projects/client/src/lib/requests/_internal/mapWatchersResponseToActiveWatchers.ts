import type { ProfileResponse } from '$lib/api.ts';
import type { ActiveWatcher } from '$lib/models/ActiveWatcher.ts';

export function mapWatchersResponseToActiveWatchers(
  watchersResponse: ProfileResponse[],
): ActiveWatcher[] {
  return watchersResponse.map((watcher) => ({
    username: watcher.username,
    private: watcher.private,
    name: watcher.name,
    isVip: watcher.vip || watcher.vip_ep,
    ids: {
      slug: watcher.ids.slug,
    },
  }));
}
