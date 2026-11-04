import type { Snippet } from 'svelte';

export type MatchRingProps = {
  score: number | null;
  size?: 'card' | 'drawer';
  badge?: Snippet;
};
