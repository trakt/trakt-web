import type { SelectOption } from './SelectOption.ts';
import type { Snippet } from 'svelte';

export type MultiSelectProps = {
  options: ReadonlyArray<SelectOption>;
  value?: string[];
  placeholder: string;
  disabled?: boolean;
  searchPlaceholder?: string;
  emptyLabel?: string;
  optionLeading?: Snippet<[SelectOption]>;
  hasOptionLeading?: (option: SelectOption) => boolean;
  onChange: (values: string[]) => void;
};
