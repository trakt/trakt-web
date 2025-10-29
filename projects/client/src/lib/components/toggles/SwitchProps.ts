import type { Snippet } from 'svelte';
import type { DpadNavigationType } from '../../features/navigation/models/DpadNavigationType.ts';

export type SwitchProps = CheckboxProps & {
  innerText?: string;
  color?: 'purple' | 'red' | 'blue' | 'orange' | 'default' | 'custom';
  navigationType?: DpadNavigationType;
  icon?: Snippet;
};
