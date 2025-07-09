import type { NowPlayingItem } from '$lib/requests/models/NowPlayingItem.ts';
import type { Writable } from 'svelte/store';

export type NowPlayingContext = {
  nowPlaying: Writable<NowPlayingItem | null>;
  remainingMinutes: Writable<number>;
  progress: Writable<number>;
};
