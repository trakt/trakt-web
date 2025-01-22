import type { ProfileResponse } from '$lib/api.ts';
import type { ActiveWatcher } from '../models/ActiveWatcher.ts';

export function mapWatcherResponseToActiveWatcher(
  watchersResponse: ProfileResponse,
): ActiveWatcher {
  return {
    username: watchersResponse.username,
    private: watchersResponse.private,
    name: watchersResponse.name,
    isVip: watchersResponse.vip || watchersResponse.vip_ep,
    slug: watchersResponse.ids.slug,
  };
}
