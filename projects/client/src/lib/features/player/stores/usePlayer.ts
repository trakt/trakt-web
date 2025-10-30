import { get } from 'svelte/store';
import { getPlayerContext } from '../_internal/getPlayerContext.ts';

export function usePlayer() {
  const { embedId, shouldAutoplay } = getPlayerContext();

  const play = (url: string, autoplay = false) => {
    const key = new URL(url).searchParams.get('v');

    embedId.set(key);
    /**
     * Reset autoplay to ensure reactivity when playing the same video twice in a row
     * this is especially relevant on iOS for the native player
     */
    if (get(shouldAutoplay)) {
      shouldAutoplay.set(false);
    }
    shouldAutoplay.set(autoplay);
  };

  return {
    preload: (url: string) => play(url, false),
    play: (url: string) => play(url, true),
  };
}
