import * as m from '$lib/features/i18n/messages.ts';
import type { DocumentaryTier } from '$lib/requests/models/DocumentaryTier.ts';

const TIER_MAP: Record<DocumentaryTier, () => string> = {
  none: m.text_documentary_tier_none,
  minor: m.text_documentary_tier_minor,
  central: m.text_documentary_tier_central,
  wide: m.text_documentary_tier_wide,
  not_enough: m.text_documentary_tier_not_enough,
};

export function toTranslatedDocumentaryTier(tier: DocumentaryTier): string {
  return TIER_MAP[tier]();
}
