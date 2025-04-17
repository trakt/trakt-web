import type { DeviceType } from '$lib/models/DeviceType.ts';
import { isTvAgent } from '$lib/utils/url/isTvAgent.ts';

export function getDeviceType(agent: string | Nil): DeviceType {
  return isTvAgent(agent) ? 'tv' : 'unknown';
}
