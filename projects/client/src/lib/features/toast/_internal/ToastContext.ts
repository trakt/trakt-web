import type { NowPlayingItem } from '$lib/requests/models/NowPlayingItem.ts';
import type { BehaviorSubject } from 'rxjs';
import type { LastWatchedItem } from '../models/LastWatchedItem.ts';

export type ToastContext = {
  nowPlaying: BehaviorSubject<NowPlayingItem | null>;
  remainingMinutes: BehaviorSubject<number>;
  progress: BehaviorSubject<number>;
  lastWatched: BehaviorSubject<LastWatchedItem | null>;
};
