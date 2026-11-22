import { WellKnownMediaQuery } from '$lib/stores/css/useMedia.ts';
import type { OrientationAccess } from '../models/OrientationAccess.ts';
import type { PermissionedOrientationEvent } from '../models/PermissionedOrientationEvent.ts';

export function detectOrientationAccess(): OrientationAccess {
  if (!globalThis.matchMedia(WellKnownMediaQuery.touch).matches) {
    return 'unsupported';
  }

  if (typeof globalThis.DeviceOrientationEvent === 'undefined') {
    return 'unsupported';
  }

  const { requestPermission } =
    globalThis.DeviceOrientationEvent as PermissionedOrientationEvent;

  return typeof requestPermission === 'function'
    ? 'needs-permission'
    : 'available';
}
