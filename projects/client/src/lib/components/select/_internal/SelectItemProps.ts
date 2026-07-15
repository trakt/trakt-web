import type { MultiSelectState } from '../models/MultiSelectState.ts';

export type SelectItemProps = {
  value: string;
  label: string;
  state?: MultiSelectState;
  excludable?: boolean;
  onCommit?: (next: MultiSelectState | undefined) => void;
};
