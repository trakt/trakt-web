import type { TierAuraTier } from '$lib/components/tier-aura/TierAuraTier.ts';

export type VipLadderTier = Exclude<TierAuraTier, 'free' | 'director'>;
