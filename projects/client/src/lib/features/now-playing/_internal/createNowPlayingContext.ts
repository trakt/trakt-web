import { getContext, setContext } from 'svelte';
import { writable } from 'svelte/store';
import type { NowPlayingContext } from './NowPlayingContext.ts';

export const NOW_PLAYING_CONTEXT = Symbol('now-playing');

export function createNowPlayingContext() {
  const ctx = setContext<NowPlayingContext>(
    NOW_PLAYING_CONTEXT,
    getContext<NowPlayingContext>(NOW_PLAYING_CONTEXT) ??
      {
        nowPlaying: writable(null),
        remainingMinutes: writable(0),
        progress: writable(0),
      },
  );

  return ctx;
}
