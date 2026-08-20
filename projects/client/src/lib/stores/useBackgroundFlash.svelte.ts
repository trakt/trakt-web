import { BACKGROUND_FLASH_DURATION } from '$lib/utils/constants.ts';
import { onDestroy, tick } from 'svelte';

export function useBackgroundFlash<T>(duration = BACKGROUND_FLASH_DURATION) {
  let flashing = $state<T | null>(null);
  let timeout: ReturnType<typeof setTimeout> | null = null;

  const clearFlashTimeout = () => {
    if (timeout != null) {
      clearTimeout(timeout);
      timeout = null;
    }
  };

  const flash = async (value: T) => {
    clearFlashTimeout();

    // Drop the value for a tick so consecutive flashes restart the animation.
    flashing = null;
    await tick();

    flashing = value;
    timeout = setTimeout(() => {
      flashing = null;
      timeout = null;
    }, duration);
  };

  onDestroy(clearFlashTimeout);

  return {
    get flashing() {
      return flashing;
    },
    flash,
  };
}
