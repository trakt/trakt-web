import type { Snippet } from 'svelte';
import type { DpadNavigationType } from '../../features/navigation/models/DpadNavigationType.ts';

/**
 * The toggle that is allowed to have a face - an icon riding in the thumb and
 * a word inside the track. Reserved for flair: the seasonal filters and the
 * design system's own theme toggle.
 *
 * Settings use `SwitchProps`, which has no such slots on purpose.
 */
export type NoveltySwitchProps = Omit<CheckboxProps, 'checked'> & {
  checked?: boolean;
  indeterminate?: boolean;
  innerText?: string;
  color?: 'purple' | 'red' | 'blue' | 'orange' | 'default' | 'custom';
  navigationType?: DpadNavigationType;
  icon?: Snippet;
};
