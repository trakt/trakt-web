import type { Snippet } from 'svelte';
import type { TierAuraTier } from './TierAuraTier.ts';

export type TierAuraProps = {
  tier: TierAuraTier;
  /**
   * Compact suits list avatars; full is the header and podium cut; inset
   * draws the band inside the face, for stacks and other tight spots.
   */
  variant?: 'inset' | 'compact' | 'full';
  /** Hover plays the aura only while its row is hovered. */
  motion?: 'live' | 'hover' | 'still';
  children: Snippet;
};
