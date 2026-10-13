import { describe, expect, it } from 'vitest';
import { toSmartListFilterParams } from './toSmartListFilterParams.ts';

describe('toSmartListFilterParams', () => {
  it('should serialize lists, ranges and toggles', () => {
    expect(
      toSmartListFilterParams({
        genres: ['drama', 'horror'],
        years: [2000, 2010],
        ignore_watched: true,
      }),
    ).toEqual({
      genres: 'drama,horror',
      years: '2000-2010',
      ignore_watched: 'true',
    });
  });

  it('should serialize scalar filters', () => {
    expect(
      toSmartListFilterParams({
        released_within_days: 90,
        watchnow_country: 'de',
        people_role: 'directing',
      }),
    ).toEqual({
      released_within_days: '90',
      watchnow_country: 'de',
      people_role: 'directing',
    });
  });

  it('should skip empty lists', () => {
    expect(toSmartListFilterParams({ keywords: [] })).toEqual({});
  });
});
