import type { Snippet } from 'svelte';

export type PopupMenuProps =
  & { items: Snippet; mode?: 'overlay' | 'standalone' }
  & Omit<ButtonProps, 'children'>;
