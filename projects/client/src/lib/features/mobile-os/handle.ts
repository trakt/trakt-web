import { extractOS } from '$lib/utils/devices/extractOS.ts';
import type { Handle } from '@sveltejs/kit';

export const OS_PLACEHOLDER = '%mobile.os%';

export const handle: Handle = (
  { event, resolve },
) => {
  const agent = event.request.headers.get('user-agent');

  return resolve(event, {
    transformPageChunk({ html, done }) {
      if (!done) return html;
      return html
        .replace(OS_PLACEHOLDER, extractOS(agent ?? ''));
    },
  });
};
