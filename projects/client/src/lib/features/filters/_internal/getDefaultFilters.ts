import { browser } from '$app/environment';
import { getDeviceType } from '$lib/utils/devices/getDeviceType.ts';
import { safeLocalStorage } from '$lib/utils/storage/safeStorage.ts';
import { STORED_FILTERS_KEY } from '../useStoredFilters.ts';
import { DEFAULT_TV_FILTERS } from './constants.ts';

export function getDefaultFilters() {
  if (!browser) {
    return null;
  }

  const saved = (() => {
    const stored = safeLocalStorage.getItem(STORED_FILTERS_KEY);
    try {
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Failed to parse saved filters:', error);
      return null;
    }
  })();

  if (saved) {
    return saved;
  }

  const isTV = getDeviceType(globalThis.navigator.userAgent) === 'tv';
  if (isTV) {
    return DEFAULT_TV_FILTERS;
  }
}
