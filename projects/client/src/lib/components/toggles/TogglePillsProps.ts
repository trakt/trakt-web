import type { ToggleOption } from './ToggleOption.ts';

export type TogglePillsProps<T> = {
  value: T;
  onChange: (value: T) => void;
  options: ToggleOption<T>[];
};
