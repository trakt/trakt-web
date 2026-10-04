import { NOOP_FN } from '$lib/utils/constants.ts';
import type { ListSelectionContext } from './ListSelectionContext.ts';

/**
 * Inert fallback for a component that calls `useListSelection()` outside a
 * `ListSelectionProvider` - e.g. `ListActions` is shared with pages that
 * never enter bulk-edit mode at all. Lets such callers gate their own
 * edit-related UI on `isEditing`/`totalCount` without a provider check of
 * their own.
 */
export const NOOP_LIST_SELECTION_CONTEXT: ListSelectionContext = {
  isEditing: false,
  selectedKeys: new Set(),
  selectedCount: 0,
  selectedItems: [],
  totalCount: 0,
  isSelected: () => false,
  enterEdit: NOOP_FN,
  exitEdit: NOOP_FN,
  click: NOOP_FN,
  selectAll: NOOP_FN,
  clearSelection: NOOP_FN,
  register: NOOP_FN,
  unregister: NOOP_FN,
};
