import { ErrorResponse } from 'oidc-client-ts';
import { describe, expect, it } from 'vitest';
import { isFatalRenewError } from './isFatalRenewError.ts';

describe('isFatalRenewError', () => {
  it('should treat a rejected refresh token as fatal', () => {
    expect(isFatalRenewError(new ErrorResponse({ error: 'invalid_grant' })))
      .toBe(true);
  });

  it('should treat a lapsed provider session as fatal', () => {
    expect(isFatalRenewError(new ErrorResponse({ error: 'login_required' })))
      .toBe(true);
  });

  it('should treat a provider outage as transient', () => {
    expect(isFatalRenewError(new ErrorResponse({ error: 'server_error' })))
      .toBe(false);
  });

  it('should treat a network failure as transient', () => {
    expect(isFatalRenewError(new TypeError('Failed to fetch'))).toBe(false);
  });

  it('should treat a status-only failure as transient', () => {
    expect(isFatalRenewError(new Error('Too Many Requests (429): {}')))
      .toBe(false);
  });

  it('should treat a thrown non-error as transient', () => {
    expect(isFatalRenewError('invalid_grant')).toBe(false);
  });
});
