import type { Snippet } from 'svelte';

export type PopupMenuProps =
  & {
    items: Snippet;
    icon?: Snippet;
    mode?: 'overlay' | 'standalone';
    size?: 'small' | 'normal';
    label?: string;
  }
  & Omit<ButtonProps, 'children'>;
