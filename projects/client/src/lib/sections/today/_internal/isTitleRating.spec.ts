import { buildFriendAction } from '$test/beds/today/buildFriendAction.ts';
import { describe, expect, it } from 'vitest';
import { isTitleRating } from './isTitleRating.ts';

describe('util: isTitleRating', () => {
  it('should accept ratings of movies and shows', () => {
    expect(isTitleRating(buildFriendAction({ kind: 'rating', rating: 8 })))
      .toBe(true);
    expect(
      isTitleRating(
        buildFriendAction({ kind: 'rating', rating: 8, target: 'show' }),
      ),
    ).toBe(true);
  });

  it('should reject ratings of episodes and seasons', () => {
    expect(
      isTitleRating(
        buildFriendAction({ kind: 'rating', rating: 8, target: 'episode' }),
      ),
    ).toBe(false);
    expect(
      isTitleRating(
        buildFriendAction({ kind: 'rating', rating: 8, target: 'season' }),
      ),
    ).toBe(false);
  });

  it('should reject other kinds of activity', () => {
    expect(isTitleRating(buildFriendAction({ kind: 'watch' }))).toBe(false);
  });
});
