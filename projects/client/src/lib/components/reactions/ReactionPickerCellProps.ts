import type { ReactionPickerOption } from './ReactionPickerOption.ts';

export type ReactionPickerCellProps<T extends string> = {
  option: ReactionPickerOption<T>;
  index: number;
  chosen: ReadonlyArray<T>;
  limit?: number;
  onSelect: (id: T) => void;
  size?: 'normal' | 'large';
};
