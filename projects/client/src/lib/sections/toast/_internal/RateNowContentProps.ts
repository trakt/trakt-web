import type { LastWatchedItem } from '$lib/features/toast/models/LastWatchedItem.ts';

export type RateNowContentProps = {
  lastWatched: LastWatchedItem;
  onHold: (item: LastWatchedItem) => void;
  onRelease: () => void;
};
