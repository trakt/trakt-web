import { isMobileAppleDevice } from '$lib/utils/devices/isMobileAppleDevice.ts';
import { getPlayerContext } from '../_internal/getPlayerContext.ts';

export function usePlayer() {
  const { embedId, shouldAutoplay } = getPlayerContext();

  const play = (url: string, autoplay = false) => {
    const key = new URL(url).searchParams.get('v');

    embedId.set(key);
    shouldAutoplay.set(autoplay);
  };

  return {
    preload: (url: string) => play(url, false),
    play: (url: string) => {
      if (isMobileAppleDevice()) {
        globalThis.window.open(url, '_blank');
        return;
      }

      play(url, true);
    },
  };
}
