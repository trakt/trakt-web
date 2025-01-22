import type { Snippet } from 'svelte';

export type TraktButtonProps = ButtonProps & {
  color?: 'purple' | 'red' | 'blue' | 'orange' | 'custom';
  variant?: 'primary' | 'secondary';
  style?: 'textured' | 'flat' | 'ghost';
  icon?: Snippet;
  subtitle?: Snippet;
  size?: 'normal' | 'small' | 'tag';
  text?: 'capitalize' | 'uppercase';
};
