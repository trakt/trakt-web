import { browser } from '$app/environment';
import { type Writable, writable } from 'svelte/store';

export type DailyOrderArrayOptions<T> = {
  key: string;
  getId: (item: T) => number;
};

function getTodayKey() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date.getTime().toString();
}

function getCachedOrder(key: string): Record<string, number[]> {
  if (!browser) {
    return {};
  }

  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : {};
}

function saveCachedOrder(key: string, ids: number[]) {
  if (!browser) {
    return;
  }

  const today = getTodayKey();
  const stored = getCachedOrder(key);

  stored[today] = ids;
  localStorage.setItem(key, JSON.stringify(stored));
}

export function useDailyOrderArray<T>(
  { key, getId }: DailyOrderArrayOptions<T>,
) {
  const list: Writable<Array<T>> = writable([]);

  const set = (update: Array<T>) => {
    if (update.length === 0) {
      list.set([]);
      return;
    }

    const today = getTodayKey();
    const cached = getCachedOrder(key);
    const todayOrder = cached[today];

    if (todayOrder == null) {
      saveCachedOrder(key, update.map(getId));
      list.set(update);
      return;
    }

    const itemMap = new Map(
      update.map((item) => [getId(item), item]),
    );

    const orderedItems = todayOrder
      .map((id) => itemMap.get(id))
      .filter((item): item is T => item !== undefined);

    const newItems = update.filter(
      (item) => !todayOrder.includes(getId(item)),
    );

    list.set([...orderedItems, ...newItems]);
  };

  return {
    list,
    set,
  };
}
