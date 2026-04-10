import type { Handle } from '@sveltejs/kit';

/**
 * Checks if the request comes from a Search Engine Crawler using
 * Cloudflare's bot category detection.
 *
 * @see https://developers.cloudflare.com/bots/concepts/bot/verified-bots/
 */
function isLegitimateBot(request: Request): boolean {
  return request.cf?.verifiedBotCategory === 'Search Engine Crawler';
}

export const handle: Handle = ({ event, resolve }) => {
  event.locals.isLegitimateBot = isLegitimateBot(event.request);

  return resolve(event);
};
