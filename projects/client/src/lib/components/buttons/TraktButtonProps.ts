import type { Snippet } from 'svelte';

export type TraktButtonProps = ButtonProps & {
  variant?: 'primary' | 'secondary' | 'vip' | 'custom';
  style?: 'textured' | 'flat' | 'ghost';
  icon?: Snippet;
  subtitle?: Snippet;
  size?: 'normal' | 'small';
  text?: 'capitalize' | 'uppercase';
};
