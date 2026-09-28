import { buildFollowingActivity } from '$test/beds/today/buildFollowingActivity.ts';
import { describe, expect, it } from 'vitest';
import { isActivityInFilter } from './isActivityInFilter.ts';

const watched = buildFollowingActivity();
const rated = buildFollowingActivity({
  key: 'rating:1',
  detail: { action: 'rating', rating: 8 },
});
const commented = buildFollowingActivity({
  key: 'comment:1',
  detail: {
    action: 'comment',
    comment: {
      id: 1,
      text: 'Loved it',
      gif: null,
      isSpoiler: false,
      isReview: false,
      likeCount: 0,
      replyCount: 0,
    },
  },
});

describe('util: isActivityInFilter', () => {
  it('should keep everything for all', () => {
    expect(
      [watched, rated, commented].every((activity) =>
        isActivityInFilter(activity, 'all')
      ),
    ).toBe(true);
  });

  it('should keep only the matching kind', () => {
    expect(isActivityInFilter(watched, 'watched')).toBe(true);
    expect(isActivityInFilter(rated, 'watched')).toBe(false);
    expect(isActivityInFilter(rated, 'rated')).toBe(true);
    expect(isActivityInFilter(commented, 'rated')).toBe(false);
    expect(isActivityInFilter(commented, 'comments')).toBe(true);
  });

  it('should drop friend activity for the for you filter', () => {
    expect(isActivityInFilter(rated, 'mine')).toBe(false);
  });
});
