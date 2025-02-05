import type { Snippet } from 'svelte';

export type PopupMenuProps =
  & { items: Snippet }
  & Omit<ButtonProps, 'children'>;
