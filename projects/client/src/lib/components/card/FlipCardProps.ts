import type { Snippet } from 'svelte';

export type FlipCardProps = {
  isFlipped: boolean;
  front: Snippet;
  back: Snippet;
};
