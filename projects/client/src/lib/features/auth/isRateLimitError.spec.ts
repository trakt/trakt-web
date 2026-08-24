import { describe, expect, it } from 'vitest';
import { isRateLimitError } from './isRateLimitError.ts';

describe('isRateLimitError', () => {
  it('should match a status carried in the message', () => {
    expect(isRateLimitError(new Error('Too Many Requests (429): {}')))
      .toBe(true);
  });

  it('should not match a longer number containing the status', () => {
    expect(isRateLimitError(new Error('failed after 4291ms'))).toBe(false);
  });

  it('should not match an unrelated status', () => {
    expect(isRateLimitError(new Error('Bad Gateway (502)'))).toBe(false);
  });

  it('should not match a thrown non-error', () => {
    expect(isRateLimitError('429')).toBe(false);
  });
});
