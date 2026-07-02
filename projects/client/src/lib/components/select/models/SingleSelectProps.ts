import type { SelectOption } from './SelectOption.ts';
import type { Snippet } from 'svelte';

export type SingleSelectProps = {
  options: ReadonlyArray<SelectOption>;
  value?: string | null;
  placeholder: string;
  disabled?: boolean;
  autoWidth?: boolean;
  optionLeading?: Snippet<[SelectOption]>;
  hasOptionLeading?: (option: SelectOption) => boolean;
  onChange: (value: string) => void;
};
