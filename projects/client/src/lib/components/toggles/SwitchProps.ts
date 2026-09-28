import type { DpadNavigationType } from '$lib/features/navigation/models/DpadNavigationType.ts';

export type SwitchProps = Omit<CheckboxProps, 'checked'> & {
  checked?: boolean;
  indeterminate?: boolean;
  navigationType?: DpadNavigationType;
};
