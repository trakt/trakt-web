import { browser } from '$app/environment';
import { safeLocalStorage } from '$lib/utils/storage/safeStorage.ts';
import { STORED_FILTERS_KEY } from '../useStoredFilters.ts';

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
}
