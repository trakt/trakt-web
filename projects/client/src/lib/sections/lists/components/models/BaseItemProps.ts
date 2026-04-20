import type { Snippet } from 'svelte';

export type BaseItemProps = {
  badge?: Snippet;
  action?: Snippet;
  tag?: Snippet;
  style?: 'cover' | 'summary' | 'compact';
  source?: string;
  popupActions?: Snippet;
  indicators?: Snippet;
};
