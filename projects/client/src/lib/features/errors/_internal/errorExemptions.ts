import { queryId } from '$lib/features/query/queryId.ts';
import { UrlBuilder } from '$lib/utils/url/UrlBuilder.ts';
import type { WellKnownError } from '../models/WellKnownErrors.ts';
import { WellKnownErrorType } from '../models/WellKnownErrors.ts';

type Exemption = {
  errorType: WellKnownErrorType;
  routes: Set<string>;
  // When set, only errors from these query keys are exempt; other failing
  // queries on the same route still get the global error page.
  sources?: Set<string>;
};

// Route ids (with dynamic segments) that handle service errors inline rather
// than replacing the page with the global "service unreachable" page.
const streamingServicesRoute = UrlBuilder.settings.streamingServices();
const streamingServicesDetailRoute = UrlBuilder.settings
  .streamingServicesDetail('[id]');

// The server-accounts endpoint surfaces per-user upstream failures
// (unreachable media server, stale server id) as 5xx/404, which must not
// read as a Trakt outage; PlexServerCard renders them inline.
const plexSettingsRoute = UrlBuilder.settings.plex();
const plexServerAccountsSource = queryId('plexServerAccounts');

// FIXME: remove this exemption when we can do clean up natively
const exemptions: Exemption[] = [
  {
    errorType: WellKnownErrorType.LockedAccountError,
    routes: new Set([UrlBuilder.settings.advanced()]),
  },
  {
    errorType: WellKnownErrorType.ServerError,
    routes: new Set([
      UrlBuilder.settings.advanced(),
      streamingServicesRoute,
      streamingServicesDetailRoute,
    ]),
  },
  {
    errorType: WellKnownErrorType.ServerError,
    routes: new Set([plexSettingsRoute]),
    sources: new Set([plexServerAccountsSource]),
  },
  {
    errorType: WellKnownErrorType.NotFoundError,
    routes: new Set([plexSettingsRoute]),
    sources: new Set([plexServerAccountsSource]),
  },
];

export function isErrorExempt(
  error: WellKnownError | undefined,
  routeId: string | null,
): boolean {
  if (!error || !routeId) return false;

  return exemptions.some(
    ({ errorType, routes, sources }) =>
      error.type === errorType &&
      routes.has(routeId) &&
      (sources == null ||
        (error.source != null && sources.has(error.source))),
  );
}
