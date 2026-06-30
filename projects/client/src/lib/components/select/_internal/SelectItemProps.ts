import type { MultiSelectState } from '../models/MultiSelectState.ts';
import type { SelectOption } from '../models/SelectOption.ts';

export type SelectItemProps = {
  option: SelectOption;
  state?: MultiSelectState;
  onCommit?: (next: MultiSelectState | undefined) => void;
};
