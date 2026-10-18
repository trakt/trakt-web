import { describe, expect, it } from 'vitest';
import { scoreLocalFits } from './scoreLocalFits.ts';

const encode = (values: number[]) =>
  btoa(String.fromCharCode(...new Uint8Array(Int8Array.from(values).buffer)));

const vectors = {
  cutoff: 0.5,
  vectors: {
    '1': encode([127, 0, 0]),
    '2': encode([114, 55, 0]),
    '3': encode([0, 0, 127]),
    '4': encode([76, 102, 0]),
    '5': encode([90, -90, 0]),
  },
};

describe('scoreLocalFits', () => {
  it('should rank the candidates that clear the cutoff, best first', () => {
    const fits = scoreLocalFits({
      picks: [1],
      candidates: [3, 4, 2],
      vectors,
    });

    expect(fits?.map(({ id }) => id)).toEqual([2, 4]);
    expect(fits?.[0]?.score).toBeCloseTo(0.9, 2);
  });

  it('should score against the weakest pick', () => {
    const fits = scoreLocalFits({
      picks: [1, 4],
      candidates: [2, 5],
      vectors,
    });

    expect(fits?.map(({ id }) => id)).toEqual([2]);
  });

  it('should skip picks and candidates without a vector', () => {
    expect(
      scoreLocalFits({ picks: [1], candidates: [1, 9, 2], vectors })?.map(
        ({ id }) => id,
      ),
    ).toEqual([2]);
  });

  it('should wait while a pick has no vector yet', () => {
    expect(
      scoreLocalFits({ picks: [1, 9], candidates: [2], vectors }),
    ).toBeNull();
    expect(scoreLocalFits({ picks: [], candidates: [2], vectors })).toBeNull();
  });
});
