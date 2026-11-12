import type { NowPlayingItem } from '$lib/requests/models/NowPlayingItem.ts';
import { CHECKIN_FINISH_PERCENTAGE } from './constants/CHECKIN_FINISH_PERCENTAGE.ts';

function toEndTime(item: NowPlayingItem) {
  const startedAt = item.startedAt.getTime();
  const expiresAt = item.expiresAt.getTime();

  if (item.action !== 'checkin') return expiresAt;

  return (
    startedAt + ((expiresAt - startedAt) * CHECKIN_FINISH_PERCENTAGE) / 100
  );
}

export function hasNowPlayingEnded(item: NowPlayingItem, now: number) {
  return now >= toEndTime(item);
}
