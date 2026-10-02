import { Environment } from '@trakt/api';

const PUBLIC_FEED_ORIGIN: HttpsUrl = 'https://trakt.tv';

// Subscribed feed URLs can't be updated later, so they use trakt.tv, which
// redirects to the API host. Staging has no such redirect.
export function calendarFeedOrigin(target: Environment): HttpsUrl {
  return target === Environment.staging ? target : PUBLIC_FEED_ORIGIN;
}
