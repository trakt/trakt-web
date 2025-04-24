import type { DeviceType } from '$lib/models/DeviceType.ts';
import { getDeviceType } from '$lib/utils/devices/getDeviceType.ts';
import type { Handle } from '@sveltejs/kit';

export const INITIAL_SCALE_PLACEHOLDER = '%viewport.initialScale%';

const SCALE_MAP: Record<DeviceType, string> = {
  unknown: '1',
  tv: '0.75',
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
        .replace(INITIAL_SCALE_PLACEHOLDER, SCALE_MAP[deviceType]);
    },
  });
};
