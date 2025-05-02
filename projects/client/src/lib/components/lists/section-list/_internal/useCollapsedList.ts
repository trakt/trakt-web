import { browser } from '$app/environment';
import { derived, readable, writable } from 'svelte/store';
import { NOOP_FN } from '../../../../utils/constants.ts';

const ITEM_PREFIX = 'list_collapsed';

export function useCollapsedList(listId: string) {
  if (!browser) {
    return {
      isCollapsed: readable(false),
      toggle: NOOP_FN,
    };
  }

  const isCollapsed = writable(
    JSON.parse(localStorage.getItem(`${ITEM_PREFIX}_${listId}`) ?? 'false'),
  );

  return {
    isCollapsed: derived(isCollapsed, (collapsed) => collapsed),
    toggle: () => {
      isCollapsed.update((collapsed) => {
        const newValue = !collapsed;
        localStorage.setItem(
          `${ITEM_PREFIX}_${listId}`,
          JSON.stringify(newValue),
        );
        return newValue;
      });
    },
  };
}
