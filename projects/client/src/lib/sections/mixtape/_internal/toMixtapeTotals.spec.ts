import { describe, expect, it } from 'vitest';
import { toMixtapeTotals } from './toMixtapeTotals.ts';

const movie = (id: number, runtime: number) => ({
  id,
  type: 'movie' as const,
  runtime,
});

describe('toMixtapeTotals', () => {
  it('should add up the runtime and average the matches', () => {
    const matches = new Map([
      [1, 90],
      [2, 75],
    ]);
    expect(
      toMixtapeTotals(
        [movie(1, 100), movie(2, 95)],
        (id) => matches.get(id) ?? null,
      ),
    ).toEqual({ minutes: 195, match: 83 });
  });

  it('should leave out the runtime once a show is in the mix', () => {
    expect(
      toMixtapeTotals(
        [movie(1, 100), { id: 2, type: 'show', runtime: 45 }],
        () => null,
      ),
    ).toEqual({ minutes: null, match: null });
  });

  it('should average only the titles with a match', () => {
    expect(
      toMixtapeTotals([movie(1, 90), movie(2, 90)], (id) =>
        id === 1 ? 80 : null,
      ),
    ).toEqual({ minutes: 180, match: 80 });
  });
});
