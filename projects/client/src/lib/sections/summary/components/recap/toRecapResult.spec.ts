import { describe, expect, it } from 'vitest';
import { toRecapResult } from './toRecapResult.ts';

describe('util: toRecapResult', () => {
  it('should be undefined while loading', () => {
    expect(toRecapResult({ isLoading: true, data: { id: 1 } })).toBeUndefined();
  });

  it('should be null when loaded without data', () => {
    expect(toRecapResult({ isLoading: false, data: undefined })).toBeNull();
    expect(toRecapResult({ isLoading: false, data: null })).toBeNull();
  });

  it('should return the data when loaded', () => {
    expect(toRecapResult({ isLoading: false, data: { id: 1 } })).toEqual({
      id: 1,
    });
  });
});
