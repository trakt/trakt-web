import type { TierAuraTier } from '$lib/components/tier-aura/TierAuraTier.ts';
import type { VipVeteranPromotion } from '$lib/features/vip-veteran/VipVeteranPromotion.ts';
import type { VipVeteran } from '$lib/requests/models/VipVeteran.ts';

export type ProfileTierTagProps = {
  tier: TierAuraTier;
  veteran: VipVeteran | Nil;
  promotion?: VipVeteranPromotion | null;
};
