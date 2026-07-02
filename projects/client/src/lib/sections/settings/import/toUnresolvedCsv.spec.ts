import { describe, expect, it } from 'vitest';
import type { UniversalImportItem } from './ImportTypes.ts';
import { toUnresolvedCsv } from './toUnresolvedCsv.ts';

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
        'title,year,action,watched_at',
        'space sweepers,2021,history,2021-02-27T16:58:29.000Z',
        'rendezvous with rama,,watchlist,',
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
        'title,year,action,watched_at',
        '"the good, the ""bad"" and the ugly",1966,history,',
      ].join('\n'),
    );
  });

  it('should return only the header for no items', () => {
    expect(toUnresolvedCsv([])).toBe('title,year,action,watched_at');
  });
});
