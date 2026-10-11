import { describe, expect, it } from 'vitest';
import { toListOverlap } from './toListOverlap.ts';

describe('toListOverlap', () => {
  it('scales confidence by the list size', () => {
    expect(toListOverlap({ count: 40, confidence: 0.5 })).toEqual({
      kept: 20,
      total: 40,
    });
  });

  it('caps the checked titles at 100', () => {
    expect(toListOverlap({ count: 450, confidence: 0.82 })).toEqual({
      kept: 82,
      total: 100,
    });
  });

  it('rounds to the nearest title', () => {
    expect(toListOverlap({ count: 7, confidence: 0.5 })).toEqual({
      kept: 4,
      total: 7,
    });
  });

  it('returns null for an empty list', () => {
    expect(toListOverlap({ count: 0, confidence: 0.9 })).toBeNull();
  });

  it('clamps out of range confidence', () => {
    expect(toListOverlap({ count: 10, confidence: 1.4 })).toEqual({
      kept: 10,
      total: 10,
    });
    expect(toListOverlap({ count: 10, confidence: -1 })).toEqual({
      kept: 0,
      total: 10,
    });
  });
});
