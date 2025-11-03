import { derived, writable } from 'svelte/store';
import { safeLocalStorage } from '../utils/storage/safeStorage.ts';

export function useCollapsedSection(
  key: string,
  defaultValue = false,
) {
  const isCollapsed = writable(
    JSON.parse(safeLocalStorage.getItem(key) ?? JSON.stringify(defaultValue)),
  );

  return {
    isCollapsed: derived(isCollapsed, (collapsed) => collapsed),
    toggle: () => {
      isCollapsed.update((collapsed) => {
        const newValue = !collapsed;
        safeLocalStorage.setItem(
          key,
          JSON.stringify(newValue),
        );
        return newValue;
      });
    },
  };
}
