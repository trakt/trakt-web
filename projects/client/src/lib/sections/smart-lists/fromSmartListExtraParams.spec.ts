import { describe, expect, it } from 'vitest';
import { fromSmartListExtraParams } from './fromSmartListExtraParams.ts';

describe('util: fromSmartListExtraParams', () => {
  it('should read every kind of extra filter', () => {
    const params = new URLSearchParams({
      keywords: 'time-travel,heist',
      votes: '1000-999999999',
      tmdb_ratings: '7.5-10',
      ignore_ended: 'true',
      released_within_days: '90',
      people_role: 'directing',
      keywords_operator: 'and',
    });

    expect(fromSmartListExtraParams(params)).toEqual({
      keywords: ['time-travel', 'heist'],
      votes: [1000, 999_999_999],
      tmdb_ratings: [7.5, 10],
      ignore_ended: true,
      released_within_days: 90,
      people_role: 'directing',
      keywords_operator: 'and',
    });
  });

  it('should ignore the regular filter panel params', () => {
    const params = new URLSearchParams({ genres: 'drama', years: '2000-2010' });

    expect(fromSmartListExtraParams(params)).toEqual({});
  });

  it('should drop values that do not fit the filter', () => {
    const params = new URLSearchParams({
      people_role: 'catering',
      released_within_days: 'soon',
      votes: 'many',
    });

    expect(fromSmartListExtraParams(params)).toEqual({});
  });
});
