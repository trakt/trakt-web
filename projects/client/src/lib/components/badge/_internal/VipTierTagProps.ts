import type { TierAuraTier } from '$lib/components/tier-aura/TierAuraTier.ts';

export type VipTierTagProps = {
  tier: TierAuraTier;
  label: string;
  title?: string | null;
};
