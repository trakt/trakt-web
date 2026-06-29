import type { Snippet } from 'svelte';

export type PopupMenuProps =
  & {
    items: Snippet;
    title: string;
    icon?: Snippet;
    mode?: 'overlay' | 'standalone';
    size?: 'small' | 'normal';
  }
  & Omit<ButtonProps, 'children'>;
