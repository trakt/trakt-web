import { ErrorTimeout } from 'oidc-client-ts';
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

type FailureMatcher = (error: unknown) => boolean;

// The messages each browser gives a fetch that never reached the server.
const FETCH_FAILURE_MESSAGES: ReadonlyArray<string> = [
  'Failed to fetch',
  'NetworkError when attempting to fetch resource.',
  'Load failed',
];

const matchesMessage =
  (messages: ReadonlyArray<string>): FailureMatcher =>
  (error) =>
    error instanceof Error && messages.includes(error.message);

const startsWithMessage =
  (prefix: string): FailureMatcher =>
  (error) =>
    error instanceof Error && error.message.startsWith(prefix);

const matchesAny =
  (...matchers: ReadonlyArray<FailureMatcher>): FailureMatcher =>
  (error) =>
    matchers.some((matches) => matches(error));

const LIBRARY_FAILURES: ReadonlyArray<readonly [FailureMatcher, string]> = [
  [
    matchesMessage([
      'No matching state found in storage',
      'State does not match',
    ]),
    'state_mismatch',
  ],
  [matchesMessage(['No state in response']), 'no_state'],
  [
    matchesMessage([
      'No client_id on state',
      'No authority on state',
      'authority mismatch on settings vs. signin state',
      'client_id mismatch on settings vs. signin state',
      'invalid request_type in state',
    ]),
    'invalid_state',
  ],
  [matchesMessage(['Expected code in response']), 'no_code'],
  [
    matchesMessage([
      'ID Token is missing a subject claim',
      'nonce in id_token does not match nonce in client storage',
      'subject from UserInfo response does not match subject in ID Token',
    ]),
    'invalid_id_token',
  ],
  [(error) => error instanceof ErrorTimeout, 'timeout'],
  [startsWithMessage('Invalid response Content-Type: '), 'invalid_response'],
  [(error) => error instanceof SyntaxError, 'parse_error'],
  [
    matchesAny(
      startsWithMessage('Metadata does not contain property '),
      matchesMessage([
        'No authority or metadataUrl configured on settings',
        'Missing keys on keyset',
      ]),
    ),
    'invalid_metadata',
  ],
  [
    matchesMessage([
      'Crypto.subtle is available only in secure contexts (HTTPS).',
    ]),
    'crypto_unavailable',
  ],
  [
    (error) =>
      error instanceof TypeError &&
      FETCH_FAILURE_MESSAGES.includes(error.message),
    'network',
  ],
];

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

  if (isRateLimitError(error)) return 'http_429';

  const failure = LIBRARY_FAILURES.find(([matches]) => matches(error));

  return failure?.[1] ?? UNKNOWN_CODE;
}
