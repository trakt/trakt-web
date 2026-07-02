import type { DirectCommentTarget } from '$lib/requests/models/DirectCommentTarget.ts';
import { describe, expect, it } from 'vitest';
import { directCommentTargetUrl } from './directCommentTargetUrl.ts';

describe('directCommentTargetUrl', () => {
  const commentId = 42;

  it.each(
    [
      [
        { type: 'movie', slug: 'heretic-2024' },
        '/movies/heretic-2024?view=review&comment_id=42',
      ],
      [
        { type: 'show', slug: 'silo' },
        '/shows/silo?view=review&comment_id=42',
      ],
      [
        { type: 'season', slug: 'silo', season: 2 },
        '/shows/silo?view=review&comment_id=42&season=2',
      ],
      [
        { type: 'episode', slug: 'silo', season: 2, episode: 3 },
        '/shows/silo?view=episode&comment_id=42&season=2&episode=3',
      ],
      [
        { type: 'list', user: 'sefer', list: 'favorites' },
        '/users/sefer/lists/favorites',
      ],
    ] satisfies Array<[DirectCommentTarget, string]>,
  )(
    'should build the contextual URL for a $type comment',
    (target, expected) => {
      expect(directCommentTargetUrl({ commentId, target })).toBe(expected);
    },
  );
});
