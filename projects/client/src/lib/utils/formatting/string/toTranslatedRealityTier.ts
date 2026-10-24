import * as m from '$lib/features/i18n/messages.ts';
import type { RealityTier } from '$lib/requests/models/RealityTier.ts';

const TIER_MAP: Record<RealityTier, () => string> = {
  faithful: m.text_reality_tier_faithful,
  mostly_true: m.text_reality_tier_mostly_true,
  loose: m.text_reality_tier_loose,
  in_name_only: m.text_reality_tier_in_name_only,
  unclear: m.text_reality_tier_unclear,
};

export function toTranslatedRealityTier(tier: RealityTier): string {
  return TIER_MAP[tier]();
}
