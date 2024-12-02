import { onDestroy, onMount } from 'svelte';
import { writable } from 'svelte/store';

export const enum WellKnownMediaQuery {
  mobile = '(max-width: 480px)',
  tabletSmall = '(min-width: 481px) and (max-width: 768px)',
  tabletLarge = '(min-width: 769px) and (max-width: 1023px)',
  desktop = '(min-width: 1024px)',
}

export function useMedia(query: string) {
  const value = writable(false);
  const media = globalThis.matchMedia(query);

  function updateValue() {
    value.set(media.matches);
  }

  onMount(() => {
    value.set(media.matches);
    media.addEventListener('change', updateValue);
  });

  onDestroy(() => {
    media.removeEventListener('change', updateValue);
  });

  return value;
}
