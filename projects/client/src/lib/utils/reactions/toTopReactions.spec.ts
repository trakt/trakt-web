import { MediaReactionSchema } from '$lib/requests/models/MediaReaction.ts';
import { toMediaReactionDistribution } from '$lib/utils/reactions/toMediaReactionDistribution.ts';
import { describe, expect, it } from 'vitest';
import { toTopReactions } from './toTopReactions.ts';

const distribution = toMediaReactionDistribution;

describe('util: toTopReactions', () => {
  const reactions = MediaReactionSchema.options;

  it('should lead with the most used', () => {
    const top = toTopReactions({
      distribution: distribution({ dislike: 3, love: 9, shocked: 5 }),
      reactions,
    });

    expect(top).toEqual(['love', 'shocked', 'dislike']);
  });

  it('should show at most three', () => {
    const top = toTopReactions({
      distribution: distribution({ love: 9, shocked: 5, dislike: 3, fire: 1 }),
      reactions,
    });

    expect(top).toEqual(['love', 'shocked', 'dislike']);
  });

  it('should drop reactions nobody picked', () => {
    expect(
      toTopReactions({ distribution: distribution({ love: 4 }), reactions }),
    ).toEqual(['love']);
  });

  it('should report nothing for a title nobody has reacted to', () => {
    expect(toTopReactions({ distribution: distribution({}), reactions }))
      .toEqual([]);
  });

  it('should treat reactions missing from a partial distribution as unused', () => {
    expect(
      toTopReactions({
        distribution: { bravo: 2, like: 5 },
        reactions: ['like', 'dislike', 'love', 'bravo'],
      }),
    ).toEqual(['like', 'bravo']);
  });
});
