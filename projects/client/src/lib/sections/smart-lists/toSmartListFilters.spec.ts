import { describe, expect, it } from 'vitest';
import { toSmartListFilters } from './toSmartListFilters.ts';

describe('toSmartListFilters', () => {
  it('splits list keys into trimmed string arrays', () => {
    expect(toSmartListFilters({ genres: 'adventure, comedy' })).to.deep.equal({
      genres: ['adventure', 'comedy'],
    });
  });

  it('parses range keys into numeric tuples', () => {
    expect(toSmartListFilters({ years: '2010-2030' })).to.deep.equal({
      years: [2010, 2030],
    });
  });

  it('parses decimal ranges into numeric tuples', () => {
    expect(toSmartListFilters({ imdb_ratings: '7.5-10' })).to.deep.equal({
      imdb_ratings: [7.5, 10],
    });
  });

  it('coerces boolean keys', () => {
    expect(
      toSmartListFilters({
        ignore_watched: 'true',
        ignore_watchlisted: 'false',
      }),
    ).to.deep.equal({
      ignore_watched: true,
      ignore_watchlisted: false,
    });
  });

  it('drops empty values and unknown keys', () => {
    expect(
      toSmartListFilters({ genres: '', unknown: 'value', countries: 'us' }),
    ).to.deep.equal({
      countries: ['us'],
    });
  });

  it('maps a full filter map into structured filters', () => {
    expect(
      toSmartListFilters({
        genres: 'adventure,comedy',
        years: '2010-2030',
        runtimes: '115-500',
        ratings: '60-100',
        imdb_ratings: '7.0-10.0',
        rt_meters: '75-100',
      }),
    ).to.deep.equal({
      genres: ['adventure', 'comedy'],
      years: [2010, 2030],
      runtimes: [115, 500],
      ratings: [60, 100],
      imdb_ratings: [7, 10],
      rt_meters: [75, 100],
    });
  });
});
