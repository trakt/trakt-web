import { UrlBuilder } from '$lib/utils/url/UrlBuilder.ts';
import type { WellKnownError } from '../models/WellKnownErrors.ts';
import { WellKnownErrorType } from '../models/WellKnownErrors.ts';

type Exemption = {
  errorType: WellKnownErrorType;
  routes: Set<string>;
};

// FIXME: remove this exemption when we can do clean up natively
const exemptions: Exemption[] = [
  {
    errorType: WellKnownErrorType.LockedAccountError,
    routes: new Set([UrlBuilder.settings.advanced()]),
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
