import type { Snippet } from 'svelte';

export type CardActionBarProps = {
  actions: Snippet;
  variant?: 'default' | 'standalone';
  surface?: 'image' | 'plain';
};
