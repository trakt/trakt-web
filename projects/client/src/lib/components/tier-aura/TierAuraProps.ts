import type { Snippet } from 'svelte';
import type { TierAuraTier } from './TierAuraTier.ts';

export type TierAuraProps = {
  tier: TierAuraTier;
  /** Compact suits list avatars; full is the header and podium cut. */
  variant?: 'compact' | 'full';
  /** Hover plays the aura only while its row is hovered. */
  motion?: 'live' | 'hover' | 'still';
  children: Snippet;
};
