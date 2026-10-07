import type { Snippet } from 'svelte';

export type DeckCardTone = 'default' | 'celebrate';

export type DeckCardProps = {
  tone: DeckCardTone;
  position: number;
  step?: { current: number; total: number } | Nil;
  copy: Snippet;
  visual?: Snippet;
  actions?: Snippet;
};
