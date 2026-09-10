import type { MultiSelectSelection } from './MultiSelectSelection.ts';
import type { SelectTriggerVariant } from './SelectTriggerVariant.ts';
import type { SelectOption } from './SelectOption.ts';

export type MultiSelectProps = {
  options: ReadonlyArray<SelectOption>;
  included?: string[];
  excluded?: string[];
  placeholder: string;
  disabled?: boolean;
  variant?: SelectTriggerVariant;
  searchPlaceholder?: string;
  emptyLabel?: string;
  onChange: (selection: MultiSelectSelection) => void;
};
