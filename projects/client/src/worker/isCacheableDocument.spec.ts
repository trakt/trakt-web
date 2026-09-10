import { describe, expect, it } from 'vitest';

import { isCacheableDocument } from './isCacheableDocument.ts';

describe('util: isCacheableDocument', () => {
  it('should cache a plain document', () => {
    expect(isCacheableDocument({ status: 200, redirected: false })).toBe(true);
  });

  it('should not cache a redirected document', () => {
    expect(isCacheableDocument({ status: 200, redirected: true })).toBe(false);
  });

  // A cached error is replayed as the page, so the visitor keeps seeing it
  // after the origin recovers.
  describe('when the origin errors', () => {
    it.each([500, 502, 503, 504])(
      'should not cache a %i',
      (status) => {
        expect(isCacheableDocument({ status, redirected: false })).toBe(false);
      },
    );

    it.each([401, 403, 404, 429])(
      'should not cache a %i',
      (status) => {
        expect(isCacheableDocument({ status, redirected: false })).toBe(false);
      },
    );
  });

  it('should not cache an opaque response', () => {
    expect(isCacheableDocument({ status: 0, redirected: false })).toBe(false);
  });

  it('should not cache a partial response', () => {
    expect(isCacheableDocument({ status: 206, redirected: false })).toBe(false);
  });
});
