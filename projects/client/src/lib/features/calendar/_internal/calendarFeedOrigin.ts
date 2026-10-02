import { Environment } from '@trakt/api';

const PUBLIC_FEED_ORIGIN: HttpsUrl = 'https://trakt.tv';

const PRODUCTION_ENVIRONMENTS: ReadonlySet<Environment> = new Set([
  Environment.production,
  Environment.production_private,
]);

// Subscribed feed URLs can't be updated later, so production uses trakt.tv,
// which redirects to the API host.
export function calendarFeedOrigin(target: Environment): HttpsUrl {
  return PRODUCTION_ENVIRONMENTS.has(target) ? PUBLIC_FEED_ORIGIN : target;
}
