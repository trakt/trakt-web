import { browser } from '$app/environment';
import { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '$lib/features/analytics/useTrack.ts';
import { NOOP_FN } from '$lib/utils/constants.ts';
import { GlobalEventBus } from '$lib/utils/events/GlobalEventBus.ts';
import { onDestroy } from 'svelte';
import { derived, get, writable } from 'svelte/store';

export type UpNextType = 'standard' | 'nitro';

const DEFAULT_UP_NEXT_TYPE: UpNextType = 'nitro';
const UP_NEXT_STORAGE_KEY = 'up-next-type-v2';

function getCachedUpNextType(): UpNextType {
  if (!browser) {
    return DEFAULT_UP_NEXT_TYPE;
  }

  const stored = localStorage.getItem(UP_NEXT_STORAGE_KEY);
  return stored ? JSON.parse(stored) : DEFAULT_UP_NEXT_TYPE;
}

function saveCachedUpNextType(type: UpNextType) {
  if (!browser) {
    return;
  }

  localStorage.setItem(UP_NEXT_STORAGE_KEY, JSON.stringify(type));
}

function updateCachedUpNextType(
  key: string,
  updater: (type: UpNextType) => void,
) {
  if (!browser) {
    return NOOP_FN;
  }

  return GlobalEventBus.getInstance().register(
    'storage',
    (event) => {
      if (event.key === key) {
        updater(event.newValue as UpNextType);
      }
    },
  );
}

const UP_NEXT_TOGGLE_TYPE_MAP = {
  standard: 'nitro',
  nitro: 'standard',
} as const;

export function useUpNextExperiment() {
  const type = writable(getCachedUpNextType());
  const { track } = useTrack(AnalyticsEvent.NitroExperiment);

  onDestroy(updateCachedUpNextType(UP_NEXT_STORAGE_KEY, type.set));

  return {
    type,
    enabled: derived(type, ($type) => $type === 'nitro'),
    toggle: () => {
      const oldType = get(type);
      const newType = UP_NEXT_TOGGLE_TYPE_MAP[oldType];

      track({ type: newType });
      /**
       * Storage events fire only when changed from other tabs.
       * We need to manually dispatch the event to update the UI, within the same tab.
       *
       * FIXME: extract generic store with storage concepts
       * lab stores should leverage that store afterwards
       */
      globalThis.dispatchEvent(
        new StorageEvent('storage', {
          key: UP_NEXT_STORAGE_KEY,
          newValue: newType,
          oldValue: oldType,
        }),
      );

      saveCachedUpNextType(newType);
      type.set(newType);
    },
  };
}
