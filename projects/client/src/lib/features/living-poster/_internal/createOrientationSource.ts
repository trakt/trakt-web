import type { OrientationAccess } from '../models/OrientationAccess.ts';
import type { LivingPosterTiltOutcome } from '../models/LivingPosterTiltOutcome.ts';
import type { OrientationAngles } from '../models/OrientationAngles.ts';
import type { PermissionedOrientationEvent } from '../models/PermissionedOrientationEvent.ts';
import { detectOrientationAccess } from './detectOrientationAccess.ts';
import { orientationPermissionSession } from './orientationPermissionSession.ts';
import { resolveOrientationAccess } from './resolveOrientationAccess.ts';
import { toOrientationTilt } from './toOrientationTilt.ts';

type CreateOrientationSourceParams = {
  onaccesschange: (access: OrientationAccess) => void;
};

const currentScreenAngle = () => globalThis.screen?.orientation?.angle ?? 0;

export function createOrientationSource({
  onaccesschange,
}: CreateOrientationSourceParams) {
  let access: OrientationAccess = 'unsupported';
  let isActive = false;
  let isListening = false;
  let baseline: OrientationAngles | null = null;
  let latest: OrientationAngles | null = null;
  let baselineScreenAngle = 0;

  const onorientation = (event: DeviceOrientationEvent) => {
    if (event.beta === null || event.gamma === null) return;

    const screenAngle = currentScreenAngle();
    latest = { beta: event.beta, gamma: event.gamma };

    if (baseline === null || screenAngle !== baselineScreenAngle) {
      baseline = latest;
      baselineScreenAngle = screenAngle;
    }
  };

  const update = () => {
    const shouldListen = isActive && access === 'available';

    if (shouldListen === isListening) return;
    isListening = shouldListen;

    if (shouldListen) {
      globalThis.addEventListener('deviceorientation', onorientation, {
        passive: true,
      });
      return;
    }

    globalThis.removeEventListener('deviceorientation', onorientation);
    baseline = null;
    latest = null;
  };

  const setAccess = (next: OrientationAccess) => {
    access = next;
    onaccesschange(next);
    update();
  };

  const connect = () => {
    setAccess(
      resolveOrientationAccess({
        detected: detectOrientationAccess(),
        remembered: orientationPermissionSession.read(),
      }),
    );

    return () => {
      isActive = false;
      update();
    };
  };

  const setActive = (next: boolean) => {
    isActive = next;
    update();
  };

  // iOS Safari only resolves this prompt when called from a user gesture.
  const requestAccess = async (): Promise<LivingPosterTiltOutcome | null> => {
    if (access !== 'needs-permission') return null;

    const { requestPermission } =
      globalThis.DeviceOrientationEvent as PermissionedOrientationEvent;

    const result = await requestPermission?.().catch(() => 'denied');
    const outcome = result === 'granted' ? 'granted' : 'denied';
    orientationPermissionSession.write(outcome);
    setAccess(outcome === 'granted' ? 'available' : 'denied');

    return outcome;
  };

  const read = () => {
    if (baseline === null || latest === null) return null;

    return toOrientationTilt({
      orientation: latest,
      baseline,
      screenAngle: baselineScreenAngle,
    });
  };

  return { connect, setActive, requestAccess, read };
}
