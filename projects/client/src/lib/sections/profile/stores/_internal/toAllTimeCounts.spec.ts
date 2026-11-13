import { UserStatsMappedMock } from '$mocks/data/users/mapped/UserStatsMappedMock.ts';
import { describe, expect, it } from 'vitest';
import { toAllTimeCounts } from './toAllTimeCounts.ts';

describe('toAllTimeCounts', () => {
  it('should map vip stats to every count', () => {
    expect(toAllTimeCounts(UserStatsMappedMock)).toEqual({
      playCount: UserStatsMappedMock.totalPlays,
      minuteCount: UserStatsMappedMock.totalMinutes,
      movieCount: UserStatsMappedMock.movies.watched,
      showCount: UserStatsMappedMock.shows.watched,
      episodeCount: UserStatsMappedMock.episodes.watched,
      commentCount: 20,
      ratingCount: UserStatsMappedMock.ratings.total,
      listCount: UserStatsMappedMock.lists,
      startedCount: 12,
      finishedCount: 34,
      droppedCount: 5,
    });
  });

  it('should lock lists and progress when the stats carry none', () => {
    const counts = toAllTimeCounts({
      ...UserStatsMappedMock,
      progress: null,
      lists: null,
    });

    expect(counts.listCount).toBeNull();
    expect(counts.startedCount).toBeNull();
    expect(counts.finishedCount).toBeNull();
    expect(counts.droppedCount).toBeNull();
  });

  it('should return zero counts without stats', () => {
    const counts = toAllTimeCounts(null);

    expect(counts.playCount).toBe(0);
    expect(counts.minuteCount).toBe(0);
    expect(counts.listCount).toBeNull();
  });
});
