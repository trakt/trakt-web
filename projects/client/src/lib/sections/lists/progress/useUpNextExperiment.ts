import { browser } from '$app/environment';
import { derived, get, writable } from 'svelte/store';

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

export function useUpNextExperiment() {
  const type = writable(getCachedUpNextType());

  return {
    type,
    enabled: derived(type, ($type) => $type === 'nitro'),
    toggle: () => {
      const newType = get(type) === 'standard' ? 'nitro' : 'standard';
      saveCachedUpNextType(newType);
      type.set(newType);
    },
  };
}
