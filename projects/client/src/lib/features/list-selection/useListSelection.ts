import { listSelectionStore } from './listSelectionStore.svelte.ts';

/**
 * Reads the shared bulk-selection state for the current list page - see
 * `listSelectionStore` for why this is a singleton rather than context.
 */
export function useListSelection() {
  return listSelectionStore;
}
