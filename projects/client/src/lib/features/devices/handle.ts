import type { DeviceType } from '$lib/models/DeviceType.ts';
import { getDeviceType } from '$lib/utils/devices/getDeviceType.ts';
import type { Handle } from '@sveltejs/kit';

export const DEVICE_SCALE_PLACEHOLDER = '%device.scale%';
export const DEVICE_TYPE_PLACEHOLDER = '%device.type%';

const SCALE_MAP: Record<DeviceType, string> = {
  unknown: '1',
  mobile: '1',
} as const;

export const handle: Handle = (
  { event, resolve },
) => {
  const agent = event.request.headers.get('user-agent');
  const deviceType = getDeviceType(agent);

  return resolve(event, {
    transformPageChunk({ html, done }) {
      if (!done) return html;
      return html
        .replace(DEVICE_SCALE_PLACEHOLDER, SCALE_MAP[deviceType])
        .replace(DEVICE_TYPE_PLACEHOLDER, deviceType);
    },
  });
};
