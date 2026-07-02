import { describe, expect, it, vi } from 'vitest';
import type { UniversalImportItem } from '../ImportTypes.ts';
import { resolveMovieIds } from './resolveMovieIds.ts';

function movie(
  overrides: Partial<UniversalImportItem> = {},
): UniversalImportItem {
  return {
    action: 'history',
    type: 'movie',
    ids: {},
    title: 'split',
    year: 2016,
    watched_at: '2020-02-08T17:21:29.000Z',
    ...overrides,
  };
}

describe('engine: resolveMovieIds', () => {
  it('should fill ids from the candidate matching the year', async () => {
    const search = vi.fn().mockResolvedValue([
      { ids: { trakt: 1968, imdb: 'tt0064715' }, year: 1968 },
      { ids: { trakt: 205932, imdb: 'tt4972582' }, year: 2016 },
    ]);

    const result = await resolveMovieIds({ items: [movie()], search });

    expect(search).toHaveBeenCalledWith('split');
    expect(result[0]).toMatchObject({
      ids: { trakt: 205932, imdb: 'tt4972582' },
      watched_at: '2020-02-08T17:21:29.000Z',
    });
  });

  it('should accept a candidate within one year of the release', async () => {
    const search = vi.fn().mockResolvedValue([
      { ids: { imdb: 'tt0108052' }, year: 1993 },
    ]);

    const result = await resolveMovieIds({
      items: [movie({ title: "schindler's list", year: 1994 })],
      search,
    });

    expect(result[0]?.ids).toEqual({ imdb: 'tt0108052' });
  });

  it('should leave movies unresolved when no candidate matches the year', async () => {
    const search = vi.fn().mockResolvedValue([
      { ids: { imdb: 'tt0064715' }, year: 1968 },
    ]);

    const result = await resolveMovieIds({ items: [movie()], search });

    expect(result[0]?.ids).toEqual({});
  });

  it('should take the top candidate for movies without a year', async () => {
    const search = vi.fn().mockResolvedValue([
      { ids: { trakt: 205932, imdb: 'tt4972582' }, year: 2016 },
      { ids: { trakt: 1968 }, year: 1968 },
    ]);

    const result = await resolveMovieIds({
      items: [movie({ year: undefined })],
      search,
    });

    expect(result[0]?.ids).toEqual({ trakt: 205932, imdb: 'tt4972582' });
  });

  it('should leave movies unresolved when the search finds nothing', async () => {
    const search = vi.fn().mockResolvedValue([]);

    const result = await resolveMovieIds({ items: [movie()], search });

    expect(result[0]?.ids).toEqual({});
  });

  it('should leave movies unresolved when the search fails', async () => {
    const search = vi.fn().mockRejectedValue(new Error('rate limited'));

    const result = await resolveMovieIds({ items: [movie()], search });

    expect(result[0]?.ids).toEqual({});
  });

  it('should not search movies that already have an id', async () => {
    const search = vi.fn();

    await resolveMovieIds({
      items: [movie({ ids: { imdb: 'tt4972582' } })],
      search,
    });

    expect(search).not.toHaveBeenCalled();
  });

  it('should not search episodes or shows', async () => {
    const search = vi.fn();

    await resolveMovieIds({
      items: [movie({ type: 'episode' }), movie({ type: 'show' })],
      search,
    });

    expect(search).not.toHaveBeenCalled();
  });

  it('should search each distinct title once and pick per item year', async () => {
    const search = vi.fn().mockResolvedValue([
      { ids: { trakt: 205932 }, year: 2016 },
      { ids: { trakt: 1968 }, year: 1968 },
    ]);

    const result = await resolveMovieIds({
      items: [movie(), movie({ year: 1968, action: 'watchlist' })],
      search,
    });

    expect(search).toHaveBeenCalledTimes(1);
    expect(result[0]?.ids).toEqual({ trakt: 205932 });
    expect(result[1]?.ids).toEqual({ trakt: 1968 });
  });

  it('should stop searching when the signal aborts', async () => {
    const search = vi.fn().mockResolvedValue([
      { ids: { trakt: 205932 }, year: 2016 },
    ]);
    const controller = new AbortController();
    controller.abort();

    const result = await resolveMovieIds({
      items: [movie()],
      search,
      signal: controller.signal,
    });

    expect(search).not.toHaveBeenCalled();
    expect(result[0]?.ids).toEqual({});
  });
});
