import { describe, expect, it } from 'vitest';
import { toRetryUri } from './toRetryUri.ts';

describe('toRetryUri', () => {
  it('should return the resolved uri when there is no fallback', () => {
    expect(toRetryUri({ current: 'a', next: 'a' })).toBe('a');
    expect(toRetryUri({ current: 'a', next: '' })).toBe('');
  });

  it('should return the resolved uri when it differs from the current one', () => {
    expect(toRetryUri({ current: 'a', next: 'b', fallback: 'f' })).toBe('b');
  });

  it('should return the fallback when the retry resolves to the same uri', () => {
    expect(toRetryUri({ current: 'a', next: 'a', fallback: 'f' })).toBe('f');
  });

  it('should return the fallback when the retry resolves to nothing', () => {
    expect(toRetryUri({ current: 'a', next: '', fallback: 'f' })).toBe('f');
  });
});
