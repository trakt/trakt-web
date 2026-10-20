import { ErrorResponse, ErrorTimeout } from 'oidc-client-ts';
import { describe, expect, it } from 'vitest';
import { toLoginFailureCode } from './toLoginFailureCode.ts';

describe('toLoginFailureCode', () => {
  it('should use the code the provider reported', () => {
    expect(toLoginFailureCode({ error: 'access_denied' })).toBe(
      'access_denied',
    );
  });

  it('should bucket an unrecognised provider code as unknown', () => {
    expect(toLoginFailureCode({ error: 'Access Denied!' })).toBe('unknown');
  });

  it('should never forward free-form provider text', () => {
    expect(toLoginFailureCode({ error: 'jane@example.com' })).toBe('unknown');
  });

  it('should report a rate limit as http_429', () => {
    expect(toLoginFailureCode(new Error('Rate limited (429)'))).toBe(
      'http_429',
    );
  });

  it('should never leak an error message', () => {
    expect(toLoginFailureCode(new Error('jane@example.com is locked'))).toBe(
      'unknown',
    );
  });

  it('should fall back for an empty provider code', () => {
    expect(toLoginFailureCode({ error: '' })).toBe('unknown');
  });

  it('should fall back for a thrown non-error', () => {
    expect(toLoginFailureCode(undefined)).toBe('unknown');
  });

  it('should use the code of a provider error response', () => {
    expect(
      toLoginFailureCode(new ErrorResponse({ error: 'access_denied' })),
    ).toBe('access_denied');
  });

  it.each([
    ['No matching state found in storage', 'state_mismatch'],
    ['State does not match', 'state_mismatch'],
    ['No state in response', 'no_state'],
    ['No client_id on state', 'invalid_state'],
    ['No authority on state', 'invalid_state'],
    ['authority mismatch on settings vs. signin state', 'invalid_state'],
    ['client_id mismatch on settings vs. signin state', 'invalid_state'],
    ['invalid request_type in state', 'invalid_state'],
    ['Expected code in response', 'no_code'],
    ['ID Token is missing a subject claim', 'invalid_id_token'],
    [
      'nonce in id_token does not match nonce in client storage',
      'invalid_id_token',
    ],
    [
      'subject from UserInfo response does not match subject in ID Token',
      'invalid_id_token',
    ],
    [
      'Invalid response Content-Type: text/html, from URL: https://example.com',
      'invalid_response',
    ],
    ['Metadata does not contain property token_endpoint', 'invalid_metadata'],
    ['No authority or metadataUrl configured on settings', 'invalid_metadata'],
    ['Missing keys on keyset', 'invalid_metadata'],
    [
      'Crypto.subtle is available only in secure contexts (HTTPS).',
      'crypto_unavailable',
    ],
  ])('should map the library message "%s" to %s', (message, code) => {
    expect(toLoginFailureCode(new Error(message))).toBe(code);
  });

  it('should map a library timeout to timeout', () => {
    expect(toLoginFailureCode(new ErrorTimeout('Network timed out'))).toBe(
      'timeout',
    );
  });

  it('should map a failed parse to parse_error', () => {
    expect(toLoginFailureCode(new SyntaxError('Unexpected token <'))).toBe(
      'parse_error',
    );
  });

  it('should map every browser fetch failure to network', () => {
    expect(
      [
        new TypeError('Failed to fetch'),
        new TypeError('NetworkError when attempting to fetch resource.'),
        new TypeError('Load failed'),
      ].map(toLoginFailureCode),
    ).toEqual(['network', 'network', 'network']);
  });

  it('should not call any other type error a network failure', () => {
    expect(
      toLoginFailureCode(new TypeError('Cannot read properties of null')),
    ).toBe('unknown');
  });

  it('should map a failed fetch to network', () => {
    expect(toLoginFailureCode(new TypeError('Failed to fetch'))).toBe(
      'network',
    );
  });

  it('should prefer the provider code over a library match', () => {
    const error = Object.assign(new Error('State does not match'), {
      error: 'server_error',
    });

    expect(toLoginFailureCode(error)).toBe('server_error');
  });

  it('should prefer a rate limit over a library match', () => {
    expect(toLoginFailureCode(new TypeError('Too Many Requests (429)'))).toBe(
      'http_429',
    );
  });

  it('should not derive a code from a known phrase followed by user text', () => {
    expect(
      toLoginFailureCode(
        new Error('No state in response for jane@example.com'),
      ),
    ).toBe('unknown');
  });

  it('should not leak user text from a known message prefix', () => {
    const code = toLoginFailureCode(
      new Error('Metadata does not contain property jane@example.com'),
    );

    expect(code).toBe('invalid_metadata');
    expect(code).not.toContain('jane');
  });

  it('should only emit codes safe for analytics', () => {
    const codes = [
      new Error('State does not match'),
      new ErrorTimeout('x'),
      new TypeError('jane@example.com'),
      new SyntaxError('jane@example.com'),
    ].map(toLoginFailureCode);

    expect(codes.every((code) => /^[a-z0-9_.:-]{1,64}$/.test(code))).toBe(true);
  });
});
