import { describe, expect, it } from 'vitest';
import { matchLevel } from './matchLevel.ts';

describe('matchLevel', () => {
  it('should light nothing without a score', () => {
    expect(matchLevel(null, 'match')).toBe(0);
    expect(matchLevel(null, 'hype')).toBe(0);
  });

  it('should map match scores to four levels at 30, 70 and 90', () => {
    expect(
      [0, 29, 30, 69, 70, 89, 90, 100].map((score) =>
        matchLevel(score, 'match'),
      ),
    ).toEqual([1, 1, 2, 2, 3, 3, 4, 4]);
  });

  it('should map hype scores to four levels at 40, 70 and 85', () => {
    expect(
      [0, 39, 40, 69, 70, 84, 85, 100].map((score) =>
        matchLevel(score, 'hype'),
      ),
    ).toEqual([1, 1, 2, 2, 3, 3, 4, 4]);
  });
});
