import { describe, expect, it } from 'vitest';
import { toPlexErrorCode } from './toPlexErrorCode.ts';

const plexError = (error_code: string) => ({
  response: {
    status: 503,
    body: {
      error_code,
      message: "Trakt can't reach this Plex media server.",
      guidance: 'Please make sure remote access is enabled.',
    },
  },
});

describe('toPlexErrorCode', () => {
  it('should extract the error code from a FetchError-shaped error', () => {
    expect(toPlexErrorCode(plexError('invalid_server_url'))).toBe(
      'invalid_server_url',
    );
  });

  it('should extract the code when the response is an array', () => {
    const error = { response: [plexError('bad_auth').response] };
    expect(toPlexErrorCode(error)).toBe('bad_auth');
  });

  it.each([
    ['nil', null],
    ['a plain Error', new Error('boom')],
    ['a response without a body', { response: { status: 500 } }],
    ['a body without an error_code', { response: { status: 500, body: {} } }],
    [
      'a non-string error_code',
      { response: { status: 500, body: { error_code: 42 } } },
    ],
  ])('should return undefined for %s', (_label, error) => {
    expect(toPlexErrorCode(error)).toBeUndefined();
  });
});
