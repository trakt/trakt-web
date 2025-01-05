import type { Handle } from '@sveltejs/kit';

const OS_PLACEHOLDER = '%mobile.os%';
function extractMobileOS(agent: string): 'android' | 'ios' | 'unknown' {
  if (/Android/i.test(agent)) {
    return 'android';
  }

  if (/iPad|iPhone|iPod/.test(agent)) {
    return 'ios';
  }

  return 'unknown';
}

export const handle: Handle = async (
  { event, resolve },
) => {
  const agent = event.request.headers.get('user-agent');

  return resolve(event, {
    transformPageChunk({ html, done }) {
      if (!done) return html;
      return html
        .replace(OS_PLACEHOLDER, extractMobileOS(agent ?? ''));
    },
  });
};
