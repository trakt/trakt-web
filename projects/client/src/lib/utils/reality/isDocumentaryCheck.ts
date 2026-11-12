import type { DocumentaryCheck } from '$lib/requests/models/DocumentaryCheck.ts';
import type { RealityCheckVariant } from '$lib/requests/models/RealityCheckVariant.ts';

export function isDocumentaryCheck(
  realityCheck: RealityCheckVariant,
): realityCheck is DocumentaryCheck {
  return 'kind' in realityCheck;
}
