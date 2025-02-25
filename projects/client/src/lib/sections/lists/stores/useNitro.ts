import { browser } from '$app/environment';
import { get, writable } from 'svelte/store';

export type UpNextType = 'standard' | 'nitro';

const UP_NEXT_STORAGE_KEY = 'up-next-type';

function getCachedUpNextType(): UpNextType {
  if (!browser) {
    return 'standard';
  }

  const stored = localStorage.getItem(UP_NEXT_STORAGE_KEY);
  return stored ? JSON.parse(stored) : 'standard';
}

function saveCachedUpNextType(type: UpNextType) {
  if (!browser) {
    return;
  }

  localStorage.setItem(UP_NEXT_STORAGE_KEY, JSON.stringify(type));
}

export function useNitro() {
  const type = writable(getCachedUpNextType());

  type.subscribe((newType) => {
    saveCachedUpNextType(newType);
  });

  return {
    type,
    toggle: () => {
      const newType = get(type) === 'standard' ? 'nitro' : 'standard';

      type.set(newType);
    },
  };
}
