import { getPlayerContext } from '../_internal/getYoutubePlayerContext.ts';

export function usePlayer() {
  const { embedId, shouldAutoplay, isLoading } = getPlayerContext();

  const play = (url: string, autoplay = false) => {
    const key = new URL(url).searchParams.get('v');

    embedId.next(key);
    /**
     * Reset autoplay to ensure reactivity when playing the same video twice in a row
     * this is especially relevant on iOS for the native player
     */
    if (shouldAutoplay.value) {
      shouldAutoplay.next(false);
    }
    shouldAutoplay.next(autoplay);
  };

  return {
    preload: (url: string) => play(url, false),
    play: (url: string) => play(url, true),
    isLoading: isLoading.asObservable(),
  };
}
