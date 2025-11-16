import type { DeviceType } from '$lib/models/DeviceType.ts';
import { extractOS } from './extractOS.ts';

export function getDeviceType(agent: string | Nil): DeviceType {
  if (['android', 'ios'].includes(extractOS(agent ?? ''))) {
    return 'mobile';
  }

  return 'unknown';
}
