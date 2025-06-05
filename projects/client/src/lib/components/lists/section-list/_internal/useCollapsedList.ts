import { derived, writable } from 'svelte/store';
import { safeLocalStorage } from '../../../../utils/storage/safeStorage.ts';

const ITEM_PREFIX = 'list_collapsed';

export function useCollapsedList(listId: string) {
  const isCollapsed = writable(
    JSON.parse(safeLocalStorage.getItem(`${ITEM_PREFIX}_${listId}`) ?? 'false'),
  );

  return {
    isCollapsed: derived(isCollapsed, (collapsed) => collapsed),
    toggle: () => {
      isCollapsed.update((collapsed) => {
        const newValue = !collapsed;
        safeLocalStorage.setItem(
          `${ITEM_PREFIX}_${listId}`,
          JSON.stringify(newValue),
        );
        return newValue;
      });
    },
  };
}
