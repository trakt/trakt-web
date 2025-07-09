import { getContext } from 'svelte';
import type { NowPlayingContext } from './NowPlayingContext.ts';
import { NOW_PLAYING_CONTEXT } from './createNowPlayingContext.ts';

export function getNowPlayingContext() {
  const context = getContext<NowPlayingContext>(NOW_PLAYING_CONTEXT);
  if (!context) {
    throw new Error(
      'Now playing context not found. Make sure to call use this within the NowPlayingProvider scope.',
    );
  }
  return context;
}
