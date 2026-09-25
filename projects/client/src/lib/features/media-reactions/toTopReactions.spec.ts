import type { ReactionDistribution } from '$lib/requests/models/ReactionDistribution.ts';
import { describe, expect, it } from 'vitest';
import { toTopReactions } from './toTopReactions.ts';

function distribution(
  counts: Partial<ReactionDistribution>,
): ReactionDistribution {
  return {
    like: 0,
    dislike: 0,
    love: 0,
    laugh: 0,
    shocked: 0,
    bravo: 0,
    spoiler: 0,
    ...counts,
  };
}

describe('util: toTopReactions', () => {
  it('should lead with the most used', () => {
    const top = toTopReactions(
      distribution({ dislike: 3, love: 9, shocked: 5 }),
    );

    expect(top).toEqual(['love', 'shocked', 'dislike']);
  });

  it('should show at most three', () => {
    const top = toTopReactions(
      distribution({ love: 9, shocked: 5, dislike: 3, spoiler: 1 }),
    );

    expect(top).toEqual(['love', 'shocked', 'dislike']);
  });

  it('should drop reactions nobody picked', () => {
    expect(toTopReactions(distribution({ love: 4 }))).toEqual(['love']);
  });

  it('should report nothing for a title nobody has reacted to', () => {
    expect(toTopReactions(distribution({}))).toEqual([]);
  });
});
