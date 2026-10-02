import type { ReactionPickerOption } from './ReactionPickerOption.ts';

export type ReactionPickerProps<T extends string> = {
  options: ReadonlyArray<ReactionPickerOption<T>>;
  chosen: ReadonlyArray<T>;
  limit?: number;
  onSelect: (id: T) => void;
  onClose?: () => void;
  quickCount?: number;
  isSearching?: boolean;
  onToggleSearch?: () => void;
};
