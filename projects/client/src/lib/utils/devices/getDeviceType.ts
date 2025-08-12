import type { DeviceType } from '$lib/models/DeviceType.ts';
import { extractOS } from './extractOS.ts';
import { isTV } from './isTV.ts';

export function getDeviceType(agent: string | Nil): DeviceType {
  if (isTV(agent)) {
    return 'tv';
  }

  if (['android', 'ios'].includes(extractOS(agent ?? ''))) {
    return 'mobile';
  }

  return 'unknown';
}
