import type { ListItem } from '$lib/requests/models/ListItem.ts';
import { setContext } from 'svelte';
import { computeRangeSelection } from './computeRangeSelection.ts';
import {
  LIST_SELECTION_CONTEXT_KEY,
  type ListSelectionContext,
  type SelectionClickModifiers,
} from './ListSelectionContext.ts';

/**
 * Creates the per-list selection state for bulk editing: which items are
 * selected, whether edit mode is active, and the rendered order every
 * `SelectableListItem` registers itself into, which shift-click ranges are
 * computed against. Items register with their full `ListItem` so bulk
 * actions (delete, and later copy) can build their request bodies straight
 * from the selection without the page having to keep a second item cache.
 */
export function createListSelectionContext(): ListSelectionContext {
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

  const context: ListSelectionContext = {
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
    isSelected: (key) => selected.has(key),
    enterEdit,
    exitEdit,
    click,
    selectAll,
    clearSelection,
    register,
    unregister,
  };

  setContext(LIST_SELECTION_CONTEXT_KEY, context);

  return context;
}
