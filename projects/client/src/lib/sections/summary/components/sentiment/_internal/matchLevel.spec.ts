import { describe, expect, it } from 'vitest';
import { matchLevel } from './matchLevel.ts';

describe('matchLevel', () => {
  it('should light nothing without a score', () => {
    expect(matchLevel(null)).toBe(0);
  });

  it('should map scores to four levels at 30, 70 and 90', () => {
    expect([0, 29, 30, 69, 70, 89, 90, 100].map(matchLevel)).toEqual([
      1, 1, 2, 2, 3, 3, 4, 4,
    ]);
  });
});
