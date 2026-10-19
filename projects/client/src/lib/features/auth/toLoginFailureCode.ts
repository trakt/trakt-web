import { isRateLimitError } from './isRateLimitError.ts';

const UNKNOWN_CODE = 'unknown';

const OAUTH_ERROR_CODES: ReadonlySet<string> = new Set([
  'access_denied',
  'account_selection_required',
  'consent_required',
  'interaction_required',
  'invalid_client',
  'invalid_grant',
  'invalid_request',
  'invalid_request_object',
  'invalid_request_uri',
  'invalid_scope',
  'login_required',
  'registration_not_supported',
  'request_not_supported',
  'request_uri_not_supported',
  'server_error',
  'temporarily_unavailable',
  'unauthorized_client',
  'unsupported_grant_type',
  'unsupported_response_type',
]);

function readProviderCode(error: unknown): string | null {
  if (typeof error !== 'object' || error === null || !('error' in error)) {
    return null;
  }

  return typeof error.error === 'string' ? error.error : null;
}

export function toLoginFailureCode(error: unknown): string {
  const providerCode = readProviderCode(error);

  if (providerCode) {
    return OAUTH_ERROR_CODES.has(providerCode) ? providerCode : UNKNOWN_CODE;
  }

  return isRateLimitError(error) ? 'http_429' : UNKNOWN_CODE;
}
