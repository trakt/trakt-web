import { describe, expect, it } from 'vitest';
import type { UniversalImportItem } from './ImportTypes.ts';
import { toUnresolvedCsv } from './toUnresolvedCsv.ts';

const HEADER =
  'title,year,action,watched_at,type,season,episode,imdb,tmdb,tvdb,trakt';

describe('util: toUnresolvedCsv', () => {
  it('should emit a header and one row per item', () => {
    const items: UniversalImportItem[] = [
      {
        action: 'history',
        type: 'movie',
        ids: {},
        title: 'space sweepers',
        year: 2021,
        watched_at: '2021-02-27T16:58:29.000Z',
      },
      {
        action: 'watchlist',
        type: 'movie',
        ids: {},
        title: 'rendezvous with rama',
      },
    ];

    expect(toUnresolvedCsv(items)).toBe(
      [
        HEADER,
        'space sweepers,2021,history,2021-02-27T16:58:29.000Z,movie,,,,,,',
        'rendezvous with rama,,watchlist,,movie,,,,,,',
      ].join('\n'),
    );
  });

  it('should include the type and every known id', () => {
    const items: UniversalImportItem[] = [
      {
        action: 'history',
        type: 'movie',
        ids: { imdb: 'tt0000001', tmdb: 2, tvdb: 3, trakt: 4 },
        title: 'made up movie',
      },
    ];

    expect(toUnresolvedCsv(items)).toBe(
      [HEADER, 'made up movie,,history,,movie,,,tt0000001,2,3,4'].join('\n'),
    );
  });

  it('should include the season and episode of episode rows', () => {
    const items: UniversalImportItem[] = [
      {
        action: 'history',
        type: 'episode',
        ids: {},
        title: 'made up show',
        season: 2,
        episode: 5,
        watched_at: '2020-01-01T00:00:00.000Z',
      },
    ];

    expect(toUnresolvedCsv(items)).toBe(
      [
        HEADER,
        'made up show,,history,2020-01-01T00:00:00.000Z,episode,2,5,,,,',
      ].join('\n'),
    );
  });

  it('should quote fields containing commas or quotes', () => {
    const items: UniversalImportItem[] = [
      {
        action: 'history',
        type: 'movie',
        ids: {},
        title: 'the good, the "bad" and the ugly',
        year: 1966,
      },
    ];

    expect(toUnresolvedCsv(items)).toBe(
      [
        HEADER,
        '"the good, the ""bad"" and the ugly",1966,history,,movie,,,,,,',
      ].join('\n'),
    );
  });

  it('should return only the header for no items', () => {
    expect(toUnresolvedCsv([])).toBe(HEADER);
  });
});
