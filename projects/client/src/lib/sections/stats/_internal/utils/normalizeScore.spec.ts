import { describe, expect, it } from 'vitest';
import { normalizeScore } from './normalizeScore.ts';

describe('normalizeScore', () => {
  it('normalizes to 0-100 range', () => {
    expect(normalizeScore(65, 130)).toBe(50);
    expect(normalizeScore(130, 130)).toBe(100);
    expect(normalizeScore(0, 130)).toBe(0);
  });

  it('clamps to 100', () => {
    expect(normalizeScore(200, 130)).toBe(100);
  });

  it('returns 0 for zero max', () => {
    expect(normalizeScore(10, 0)).toBe(0);
  });
});
