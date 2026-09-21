import { EMOJI_BASE_URL } from './EMOJI_BASE_URL.ts';
import { MEDIA_REACTIONS_CODE_MAP } from './MEDIA_REACTIONS_CODE_MAP.ts';

let isPrefetched = false;

/**
 * Warms the browser cache with the static emoji for the picker so the grid
 * paints in one go instead of fading in one image at a time. Runs once per
 * session, off the critical path.
 */
export function prefetchReactionEmojis() {
  if (isPrefetched || typeof window === 'undefined') return;
  isPrefetched = true;

  const load = () =>
    Object.values(MEDIA_REACTIONS_CODE_MAP).forEach((code) => {
      new Image().src = `${EMOJI_BASE_URL}/${code}/emoji.svg`;
    });

  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(load);
    return;
  }

  setTimeout(load, 0);
}
