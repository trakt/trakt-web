import { YirDetailMappedMock } from '$mocks/data/users/mapped/YirDetailMappedMock.ts';
import { describe, expect, it } from 'vitest';
import { toMonthReviewFromDetail } from './toMonthReviewFromDetail.ts';

describe('util: toMonthReviewFromDetail', () => {
  const review = toMonthReviewFromDetail({ detail: YirDetailMappedMock });

  it('should map the totals', () => {
    expect(review.tier).toBe('vip');
    expect(review.plays).toBe(30);
    expect(review.episodes).toBe(24);
    expect(review.minutes).toBe(1350);
  });

  it('should rank shows and movies together by plays', () => {
    expect(review.titles.map(({ plays }) => plays)).toEqual([14, 10, 4, 2]);
  });

  it('should rank top rated titles by rating', () => {
    expect(review.topRated?.map(({ rating }) => rating)).toEqual([9, 8]);
  });

  it('should merge show and movie genres', () => {
    expect(review.genres?.map(({ key }) => key)).toEqual(['drama', 'horror']);
  });

  it('should keep the episode on the first play', () => {
    expect(review.firstPlay?.episode?.title).toBe('Freedom Day');
    expect(review.lastPlay?.episode).toBeUndefined();
  });

  it('should omit fields the detail does not have', () => {
    expect('activeDays' in review).toBe(false);
    expect('previous' in review).toBe(false);
  });

  it('should split the month by shows and movies', () => {
    expect(review.byType?.shows.plays).toBe(24);
    expect(review.byType?.movies.plays).toBe(6);
    expect(review.byType?.shows.titles.at(0)?.minutes).toBe(700);
  });

  it('should sum show and movie series when the total has none', () => {
    const withSeries = toMonthReviewFromDetail({
      detail: {
        ...YirDetailMappedMock,
        stats: {
          ...YirDetailMappedMock.stats,
          shows: {
            ...YirDetailMappedMock.stats.shows,
            distributions: {
              weekly: [],
              monthly: [],
              days: [],
              daily: [1, 0, 2],
              hourly: [0, 3],
            },
          },
          movies: {
            ...YirDetailMappedMock.stats.movies,
            distributions: {
              weekly: [],
              monthly: [],
              days: [],
              daily: [0, 0, 1],
              hourly: [1, 0],
            },
          },
        },
      },
    });

    expect(withSeries.dailyPlays).toEqual([1, 0, 3]);
    expect(withSeries.hourlyPlays).toEqual([1, 3]);
    expect(withSeries.activeDays).toBe(2);
  });

  it('should add the previous month totals when given', () => {
    const withPrevious = toMonthReviewFromDetail({
      detail: YirDetailMappedMock,
      previous: YirDetailMappedMock,
    });

    expect(withPrevious.previous).toEqual({
      plays: 30,
      minutes: 1350,
      minutesPerDay: 0,
    });
  });
});
