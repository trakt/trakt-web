import type { DeviceType } from '$lib/models/DeviceType.ts';
import { isTV } from './isTV.ts';

export function getDeviceType(agent: string | Nil): DeviceType {
  return isTV(agent) ? 'tv' : 'unknown';
}
