import { useCollapsedSection } from '$lib/stores/useCollapsedSection.ts';

const ITEM_PREFIX = 'list_collapsed';

export function useCollapsedList(listId: string) {
  return useCollapsedSection(`${ITEM_PREFIX}_${listId}`);
}
