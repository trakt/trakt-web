import { UserStatsMappedMock } from '$mocks/data/users/mapped/UserStatsMappedMock.ts';
import { describe, expect, it } from 'vitest';
import { toFreeAllTimeCounts } from './toFreeAllTimeCounts.ts';

describe('toFreeAllTimeCounts', () => {
  it('should keep the countable stats and the comment count', () => {
    const counts = toFreeAllTimeCounts({
      stats: UserStatsMappedMock,
      commentCount: 7,
    });

    expect(counts).toMatchObject({
      playCount: UserStatsMappedMock.totalPlays,
      movieCount: UserStatsMappedMock.movies.watched,
      showCount: UserStatsMappedMock.shows.watched,
      episodeCount: UserStatsMappedMock.episodes.watched,
      ratingCount: UserStatsMappedMock.ratings.total,
      commentCount: 7,
    });
  });

  it('should lock hours, lists and progress', () => {
    const counts = toFreeAllTimeCounts({
      stats: UserStatsMappedMock,
      commentCount: 7,
    });

    expect(counts.minuteCount).toBeNull();
    expect(counts.listCount).toBeNull();
    expect(counts.startedCount).toBeNull();
    expect(counts.finishedCount).toBeNull();
    expect(counts.droppedCount).toBeNull();
  });

  it('should fall back to zero comments when the count is unknown', () => {
    const counts = toFreeAllTimeCounts({
      stats: UserStatsMappedMock,
      commentCount: null,
    });

    expect(counts.commentCount).toBe(0);
  });
});
