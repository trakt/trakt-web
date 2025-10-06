import { browser } from '$app/environment';
import { safeLocalStorage } from '$lib/utils/storage/safeStorage.ts';
import { type MonoTypeOperatorFunction } from 'rxjs';
import { tap } from 'rxjs/operators';
import { type Identity, orderArray } from './orderArray.ts';

export type DailyOrderArrayOptions<T> = {
  key: string;
  getId: (item: T) => Identity;
};

function getTodayKey() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date.getTime().toString();
}

function getCachedOrder(key: string): Record<string, Identity[]> {
  const stored = safeLocalStorage.getItem(key);
  return stored ? JSON.parse(stored) : {};
}

function saveCachedOrder(key: string, ids: Identity[]) {
  if (!browser) {
    return;
  }

  const today = getTodayKey();

  safeLocalStorage.setItem(key, JSON.stringify({ [today]: ids }));
}

/**
 * RxJS operator that orders an array based on cached daily order from localStorage.
 * Automatically saves the final order back to localStorage.
 */
export function dailyOrderArray<T>(
  key: string,
  getId: (item: T) => Identity,
): MonoTypeOperatorFunction<Array<T>> {
  const today = getTodayKey();
  const cached = getCachedOrder(key);
  const cachedOrder = cached[today];
  return (source) =>
    source.pipe(
      orderArray(getId, cachedOrder),
      tap((orderedItems) => {
        if (orderedItems.length > 0) {
          saveCachedOrder(key, orderedItems.map(getId));
        }
      }),
    );
}
