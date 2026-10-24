import * as m from '$lib/features/i18n/messages.ts';
import type { RealityClaim } from '$lib/requests/models/RealityCheck.ts';

const CLAIM_LABEL_MAP: Record<RealityClaim['label'], () => string> = {
  accurate: m.text_reality_claim_accurate,
  compressed: m.text_reality_claim_compressed,
  composite: m.text_reality_claim_composite,
  changed: m.text_reality_claim_changed,
  invented: m.text_reality_claim_invented,
};

export function toTranslatedRealityClaimLabel(
  label: RealityClaim['label'],
): string {
  return CLAIM_LABEL_MAP[label]();
}
