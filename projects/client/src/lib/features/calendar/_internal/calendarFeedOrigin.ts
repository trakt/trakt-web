import { Environment } from '@trakt/api';

const PUBLIC_FEED_ORIGIN = 'https://trakt.tv';

const PRODUCTION_ENVIRONMENTS: ReadonlySet<Environment> = new Set([
  Environment.production,
  Environment.production_private,
]);

// Feed URLs live on in third-party calendar apps and can't be updated once
// subscribed, so production hands out trakt.tv, which Cloudflare redirects
// to the API host. Other environments have no such redirect and keep their
// API host.
export function calendarFeedOrigin(target: Environment): string {
  return PRODUCTION_ENVIRONMENTS.has(target) ? PUBLIC_FEED_ORIGIN : target;
}
