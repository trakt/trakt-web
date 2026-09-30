import { tick } from 'svelte';

export function useBackgroundFlash<T>() {
  let flashing = $state<T | null>(null);

  const flash = async (value: T) => {
    flashing = null;
    await tick();
    flashing = value;
  };

  const clear = (event: AnimationEvent) => {
    if (event.animationName !== 'background-flash') {
      return;
    }

    flashing = null;
  };

  return {
    get flashing() {
      return flashing;
    },
    flash,
    clear,
  };
}
