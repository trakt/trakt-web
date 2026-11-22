import type { LivingPosterTiltOutcome } from '../models/LivingPosterTiltOutcome.ts';
import type { OrientationAccess } from '../models/OrientationAccess.ts';

type ResolveOrientationAccessParams = {
  detected: OrientationAccess;
  remembered: LivingPosterTiltOutcome | null;
};

export function resolveOrientationAccess({
  detected,
  remembered,
}: ResolveOrientationAccessParams): OrientationAccess {
  if (detected !== 'needs-permission') return detected;
  if (remembered === 'granted') return 'available';
  if (remembered === 'denied') return 'denied';

  return 'needs-permission';
}
