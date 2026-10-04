import { NOOP_LIST_SELECTION_CONTEXT } from './_internal/NOOP_LIST_SELECTION_CONTEXT.ts';
import { getListSelectionContext } from './_internal/getListSelectionContext.ts';

/**
 * Reads the bulk-selection state set up by `ListSelectionProvider`. Safe to
 * call from a component that is not always rendered inside one (e.g.
 * `ListActions`, shared with pages that never enter bulk-edit mode) - it
 * falls back to an inert no-op context rather than throwing.
 */
export function useListSelection() {
  return getListSelectionContext() ?? NOOP_LIST_SELECTION_CONTEXT;
}
