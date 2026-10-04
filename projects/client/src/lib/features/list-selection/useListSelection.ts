import { getListSelectionContext } from './_internal/getListSelectionContext.ts';

/**
 * Reads the bulk-selection state set up by `ListSelectionProvider`. Use from
 * any component inside that provider - the list grid (to register/unregister
 * item keys and render the selection overlay), and the fixed action header
 * (to read the count and drive select-all / exit).
 */
export function useListSelection() {
  return getListSelectionContext();
}
