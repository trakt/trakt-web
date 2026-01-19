import type { Snippet } from 'svelte';

export type BaseItemProps = {
  badge?: Snippet;
  action?: Snippet;
  tag?: Snippet;
  style?: 'cover' | 'summary';
  source?: string;
  popupActions?: Snippet;
};
