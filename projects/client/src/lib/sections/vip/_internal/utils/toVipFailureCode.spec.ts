import { describe, expect, it } from 'vitest';
import { toVipFailureCode } from './toVipFailureCode.ts';

const CODE_PATTERN = /^[a-z0-9_.:-]{1,64}$/;

describe('util: toVipFailureCode', () => {
  it('should map a failed request to its http status', () => {
    const error = Object.assign(new Error('Failed to fetch data'), {
      response: { status: 500, body: {} },
    });

    expect(toVipFailureCode(error)).toBe('http_500');
  });

  it('should read the first status of a batched response', () => {
    const error = Object.assign(new Error('Failed'), {
      response: [{ status: 429 }, { status: 500 }],
    });

    expect(toVipFailureCode(error)).toBe('http_429');
  });

  it('should map a connectivity failure to network', () => {
    expect(toVipFailureCode(new TypeError('Failed to fetch'))).toBe('network');
  });

  it.each([
    ['a plain error', new Error('boom with spaces')],
    ['a string', 'boom'],
    ['null', null],
    ['an empty response', Object.assign(new Error(), { response: null })],
  ])('should map %s to unknown', (_, error) => {
    expect(toVipFailureCode(error)).toBe('unknown');
  });

  it('should never leak an exception message', () => {
    const code = toVipFailureCode(new Error('Secret: Bearer abc.def'));

    expect(code).toMatch(CODE_PATTERN);
  });
});
