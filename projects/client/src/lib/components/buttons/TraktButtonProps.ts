import type { DpadNavigationType } from '$lib/features/navigation/models/DpadNavigationType.ts';
import type { Snippet } from 'svelte';

export type TraktButtonProps = ButtonProps & {
  color?: 'purple' | 'red' | 'blue' | 'orange' | 'default' | 'custom';
  variant?: 'primary' | 'secondary';
  style?: 'flat' | 'ghost' | 'underlined' | 'outline';
  shape?: 'rounded' | 'pill';
  icon?: Snippet;
  iconPlacement?: 'start' | 'end';
  subtitle?: Snippet;
  size?: 'normal' | 'small' | 'tag';
  text?: 'capitalize' | 'uppercase' | 'none';
  navigationType?: DpadNavigationType;
};
