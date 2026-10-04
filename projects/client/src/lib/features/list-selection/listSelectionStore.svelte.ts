import type { ListItem } from '$lib/requests/models/ListItem.ts';
import { computeRangeSelection } from './_internal/computeRangeSelection.ts';
import type {
  ListSelectionContext,
  SelectionClickModifiers,
} from './_internal/ListSelectionContext.ts';

/**
 * Bulk-selection state for a list's items: which are selected, whether edit
 * mode is active, and the rendered order every `SelectableListItem`
 * registers itself into, which shift-click ranges are computed against.
 *
 * This is a plain module-level singleton, not Svelte context. `ListActions`
 * (the entry point, in the list's "..." menu) and the grid of
 * `SelectableListItem`s are unrelated branches of the component tree - the
 * menu is rendered by the global `TopNavbar` off of `useNavbarState()`'s
 * store, not as a descendant of the page that set it. Context can only flow
 * to actual descendants, so a shared module singleton is the only thing both
 * sides can reach. Only one list page is ever open at a time, so a single
 * instance is enough; `reset()` clears it between list pages.
 */
export function createListSelectionStore(): ListSelectionContext & {
  reset: () => void;
} {
  let isEditing = $state(false);
  let selected = $state<Set<string>>(new Set());
  let order = $state<string[]>([]);
  let itemsByKey = $state<Map<string, ListItem>>(new Map());
  let anchorKey = $state<string | Nil>(null);

  function enterEdit(initialKey?: string) {
    isEditing = true;

    if (initialKey) {
      selected = new Set([initialKey]);
      anchorKey = initialKey;
    }
  }

  function exitEdit() {
    isEditing = false;
    selected = new Set();
    anchorKey = null;
  }

  function reset() {
    exitEdit();
    order = [];
    itemsByKey = new Map();
  }

  function toggleOne(key: string) {
    const next = new Set(selected);

    if (next.has(key)) {
      next.delete(key);
    } else {
      next.add(key);
    }

    selected = next;
    anchorKey = key;
  }

  function click(key: string, modifiers?: SelectionClickModifiers) {
    if (!isEditing) {
      enterEdit(key);
      return;
    }

    if (modifiers?.shiftKey && anchorKey) {
      const range = computeRangeSelection({
        order,
        anchorKey,
        targetKey: key,
      });
      selected = new Set([...selected, ...range]);
      return;
    }

    toggleOne(key);
  }

  function selectAll() {
    selected = new Set(order);
  }

  function clearSelection() {
    selected = new Set();
  }

  function register(item: ListItem) {
    if (!itemsByKey.has(item.key)) {
      itemsByKey = new Map(itemsByKey).set(item.key, item);
    }

    if (!order.includes(item.key)) {
      order = [...order, item.key];
    }
  }

  function unregister(key: string) {
    order = order.filter((entry) => entry !== key);

    if (itemsByKey.has(key)) {
      const nextItems = new Map(itemsByKey);
      nextItems.delete(key);
      itemsByKey = nextItems;
    }

    if (selected.has(key)) {
      const next = new Set(selected);
      next.delete(key);
      selected = next;
    }
  }

  return {
    get isEditing() {
      return isEditing;
    },
    get selectedKeys() {
      return selected;
    },
    get selectedCount() {
      return selected.size;
    },
    get selectedItems() {
      return [...selected].flatMap((key) => itemsByKey.get(key) ?? []);
    },
    get totalCount() {
      return order.length;
    },
    isSelected: (key) => selected.has(key),
    enterEdit,
    exitEdit,
    reset,
    click,
    selectAll,
    clearSelection,
    register,
    unregister,
  };
}

export const listSelectionStore = createListSelectionStore();
