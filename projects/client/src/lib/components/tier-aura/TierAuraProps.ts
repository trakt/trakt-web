import type { Snippet } from 'svelte';
import type { TierAuraTier } from './TierAuraTier.ts';

export type TierAuraProps = {
  tier: TierAuraTier;
  variant?: 'inset' | 'compact' | 'full';
  motion?: 'live' | 'hover' | 'still';
  children: Snippet;
};
