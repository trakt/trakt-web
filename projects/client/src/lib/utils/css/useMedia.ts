import { onDestroy, onMount } from 'svelte';
import { writable } from 'svelte/store';

export const enum WellKnownMediaQuery {
  mobile = '(max-width: 480px)',
  tablet = '(min-width: 481px) and (max-width: 768px)',
  desktop = '(min-width: 769px)',
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
