import type { Snippet } from 'svelte';
import type { DpadNavigationType } from '../../features/navigation/models/DpadNavigationType.ts';

export type SwitchProps = Omit<CheckboxProps, 'checked'> & {
  checked?: boolean;
  indeterminate?: boolean;
  innerText?: string;
  color?: 'purple' | 'red' | 'blue' | 'orange' | 'default' | 'custom';
  navigationType?: DpadNavigationType;
  icon?: Snippet;
};
