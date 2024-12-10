import { browser } from '$app/environment';
import { debounce } from '$lib/utils/timing/debounce.ts';
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
  const media = browser ? globalThis.matchMedia(query) : {
    matches: false,
    addEventListener: () => {},
    removeEventListener: () => {},
  };

  function updateValue() {
    /*
      We debounce here to catch intermediary states of the media query.
      For example, when going from tabletLarge to desktop, tabletLarge
      will first be set to false (at which time desktop is also still false),
      and then desktop will be set to true, resulting in "false, false", and
      then "false, true" as the final state.
    */
    debounce(() => value.set(media.matches), 1000 / 30)();
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
