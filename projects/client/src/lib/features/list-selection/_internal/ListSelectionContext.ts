import type { ListItem } from '$lib/requests/models/ListItem.ts';

export const LIST_SELECTION_CONTEXT_KEY = Symbol('list-selection-context');

export type SelectionClickModifiers = {
  shiftKey: boolean;
  ctrlKey: boolean;
  metaKey: boolean;
};

export type ListSelectionContext = {
  readonly isEditing: boolean;
  readonly selectedKeys: ReadonlySet<string>;
  readonly selectedCount: number;
  readonly selectedItems: ListItem[];
  /** Every item currently registered (i.e. loaded and rendered). */
  readonly totalCount: number;
  isSelected: (key: string) => boolean;
  enterEdit: (initialKey?: string) => void;
  exitEdit: () => void;
  click: (key: string, modifiers?: SelectionClickModifiers) => void;
  selectAll: () => void;
  clearSelection: () => void;
  register: (item: ListItem) => void;
  unregister: (key: string) => void;
};
