import { UrlBuilder } from '$lib/utils/url/UrlBuilder.ts';
import type { WellKnownError } from '../models/WellKnownErrors.ts';
import { WellKnownErrorType } from '../models/WellKnownErrors.ts';

type Exemption = {
  errorType: WellKnownErrorType;
  routes: Set<string>;
};

// Route ids (with dynamic segments) that handle service errors inline rather
// than replacing the page with the global "service unreachable" page.
const streamingServicesRoute = UrlBuilder.settings.streamingServices();
const streamingServicesDetailRoute = UrlBuilder.settings
  .streamingServicesDetail('[id]');

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
];

export function isErrorExempt(
  error: WellKnownError | undefined,
  routeId: string | null,
): boolean {
  if (!error || !routeId) return false;

  return exemptions.some(
    ({ errorType, routes }) => error.type === errorType && routes.has(routeId),
  );
}
