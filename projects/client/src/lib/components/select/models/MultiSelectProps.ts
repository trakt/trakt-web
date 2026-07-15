import type { MultiSelectSelection } from './MultiSelectSelection.ts';
import type { SelectOption } from './SelectOption.ts';

export type MultiSelectProps = {
  options: ReadonlyArray<SelectOption>;
  included?: string[];
  excluded?: string[];
  placeholder: string;
  disabled?: boolean;
  onChange: (selection: MultiSelectSelection) => void;
};
