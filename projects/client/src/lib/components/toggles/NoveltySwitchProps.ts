import type { Snippet } from 'svelte';
import type { SwitchProps } from './SwitchProps.ts';

export type NoveltySwitchProps = SwitchProps & {
  innerText?: string;
  color?: 'purple' | 'red' | 'blue' | 'orange' | 'default' | 'custom';
  icon?: Snippet;
};
