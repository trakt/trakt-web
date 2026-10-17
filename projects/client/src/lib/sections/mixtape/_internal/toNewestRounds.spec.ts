import { describe, expect, it } from 'vitest';
import { toNewestRounds } from './toNewestRounds.ts';

describe('toNewestRounds', () => {
  it('should list rounds newest first, numbered from the first round', () => {
    expect(toNewestRounds([['a', 'b'], ['c']])).toEqual([
      { media: ['c'], round: 2 },
      { media: ['a', 'b'], round: 1 },
    ]);
  });

  it('should skip an empty round, such as one just started', () => {
    expect(toNewestRounds([['a'], []])).toEqual([{ media: ['a'], round: 1 }]);
  });
});
