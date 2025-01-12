import type { Handle } from '@sveltejs/kit';

export const TIMESTAMP_PLACEHOLDER = '%cache.timestamp%';
export const handle: Handle = ({ event, resolve }) => {
  return resolve(event, {
    transformPageChunk({ html, done }) {
      if (!done) return html;
      return html
        .replace(TIMESTAMP_PLACEHOLDER, Date.now().toString());
    },
  });
};
