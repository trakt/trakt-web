import { ErrorResponse } from 'oidc-client-ts';

const fatalErrorCodes = [
  'invalid_grant',
  'invalid_client',
  'unauthorized_client',
  'invalid_scope',
  'access_denied',
  'login_required',
  'consent_required',
  'interaction_required',
];

export function isFatalRenewError(error: unknown): boolean {
  if (!(error instanceof ErrorResponse)) {
    return false;
  }

  return fatalErrorCodes.includes(error.error ?? '');
}
