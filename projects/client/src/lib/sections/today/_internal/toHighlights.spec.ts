import { MovieHereticMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticMappedMock.ts';
import { buildFriendAction } from '$test/beds/today/buildFriendAction.ts';
import { describe, expect, it } from 'vitest';
import type { TodayFriendAction } from '../models/TodayFriendAction.ts';
import type { TodayPersonAction } from '../models/TodayPersonAction.ts';
import { toHighlights } from './toHighlights.ts';

const comment = (
  isSpoiler: boolean,
  text = 'Go in blind.',
): NonNullable<TodayFriendAction['comment']> => ({
  id: 1,
  text,
  gif: null,
  isSpoiler,
  isReview: false,
  likeCount: 0,
  replyCount: 0,
});

function personAction(
  overrides: Partial<TodayFriendAction>,
): TodayPersonAction {
  return { ...buildFriendAction(overrides), media: MovieHereticMappedMock };
}

describe('util: toHighlights', () => {
  it('should find nothing without comments or ratings', () => {
    expect(toHighlights([personAction({ kind: 'watch' })])).toEqual({
      comment: null,
      rating: null,
    });
  });

  it('should pick the first quotable comment and the first rating', () => {
    const highlights = toHighlights([
      personAction({ key: 'spoiler', kind: 'comment', comment: comment(true) }),
      personAction({ key: 'quote', kind: 'comment', comment: comment(false) }),
      personAction({ key: 'rate', kind: 'rating', rating: 9 }),
    ]);

    expect(highlights.comment?.key).toBe('quote');
    expect(highlights.rating?.key).toBe('rate');
  });

  it('should ignore ratings of episodes and seasons', () => {
    const highlights = toHighlights([
      personAction({ kind: 'rating', rating: 8, target: 'episode' }),
      personAction({ kind: 'rating', rating: 7, target: 'season' }),
    ]);

    expect(highlights.rating).toBeNull();
  });
});
