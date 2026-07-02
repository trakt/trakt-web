import { describe, expect, it, vi } from 'vitest';
import type { UniversalImportItem } from '../ImportTypes.ts';
import type { MovieMatchResult } from './matchMovies.ts';
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

function matched(
  index: number,
  ids: MovieMatchResult['match'],
): MovieMatchResult {
  return { index, status: 'matched', match: ids };
}

describe('engine: resolveMovieIds', () => {
  it('should fill ids for matched movies', async () => {
    const match = vi.fn().mockResolvedValue([
      matched(0, {
        title: 'Split',
        year: 2016,
        score: 2582,
        ids: { trakt: 247643, imdb: 'tt3315656', tmdb: 358364 },
      }),
    ]);

    const { items, ambiguous } = await resolveMovieIds({
      items: [movie()],
      match,
    });

    expect(match).toHaveBeenCalledWith([
      { index: 0, title: 'split', year: 2016 },
    ]);
    expect(items[0]).toMatchObject({
      ids: { trakt: 247643, imdb: 'tt3315656', tmdb: 358364 },
      watched_at: '2020-02-08T17:21:29.000Z',
    });
    expect(ambiguous).toHaveLength(0);
  });

  it('should collect ambiguous movies with their candidates', async () => {
    const match = vi.fn().mockResolvedValue(
      [
        {
          index: 0,
          status: 'ambiguous',
          match: null,
          candidates: [
            {
              title: 'Split',
              year: 2017,
              score: 21573,
              poster:
                'media.trakt.tv/images/movies/000/254/263/posters/medium/aaa0f03e5e.jpg.webp',
              ids: { trakt: 254263, imdb: 'tt4972582', tmdb: 381288 },
            },
            {
              title: 'Split',
              year: 2016,
              score: 2582,
              poster: null,
              ids: { trakt: 247643, imdb: 'tt3315656', tmdb: 358364 },
            },
          ],
        },
      ] satisfies MovieMatchResult[],
    );

    const { items, ambiguous } = await resolveMovieIds({
      items: [movie()],
      match,
    });

    expect(items[0]?.ids).toEqual({});
    expect(ambiguous).toHaveLength(1);
    expect(ambiguous[0]?.item).toBe(items[0]);
    expect(ambiguous[0]?.candidates).toEqual([
      {
        title: 'Split',
        year: 2017,
        poster:
          'https://media.trakt.tv/images/movies/000/254/263/posters/medium/aaa0f03e5e.jpg.webp',
        ids: { trakt: 254263, imdb: 'tt4972582', tmdb: 381288 },
      },
      {
        title: 'Split',
        year: 2016,
        poster: undefined,
        ids: { trakt: 247643, imdb: 'tt3315656', tmdb: 358364 },
      },
    ]);
  });

  it('should leave not_found movies unresolved', async () => {
    const match = vi.fn().mockResolvedValue(
      [
        { index: 0, status: 'not_found', match: null },
      ] satisfies MovieMatchResult[],
    );

    const { items, ambiguous } = await resolveMovieIds({
      items: [movie()],
      match,
    });

    expect(items[0]?.ids).toEqual({});
    expect(ambiguous).toHaveLength(0);
  });

  it('should leave movies unresolved when the match call fails', async () => {
    const match = vi.fn().mockRejectedValue(new Error('rate limited'));

    const { items } = await resolveMovieIds({ items: [movie()], match });

    expect(items[0]?.ids).toEqual({});
  });

  it('should not match movies that already have an id', async () => {
    const match = vi.fn().mockResolvedValue([]);

    await resolveMovieIds({
      items: [movie({ ids: { imdb: 'tt4972582' } })],
      match,
    });

    expect(match).not.toHaveBeenCalled();
  });

  it('should not match episodes or shows', async () => {
    const match = vi.fn().mockResolvedValue([]);

    await resolveMovieIds({
      items: [movie({ type: 'episode' }), movie({ type: 'show' })],
      match,
    });

    expect(match).not.toHaveBeenCalled();
  });

  it('should query distinct title+year pairs once', async () => {
    const match = vi.fn().mockResolvedValue([
      matched(0, {
        title: 'Split',
        year: 2016,
        score: 2582,
        ids: { trakt: 247643, imdb: 'tt3315656', tmdb: 358364 },
      }),
      matched(1, {
        title: 'Split',
        year: 1968,
        score: 421,
        ids: { trakt: 1968, imdb: 'tt0064715', tmdb: 5142 },
      }),
    ]);

    const { items } = await resolveMovieIds({
      items: [
        movie(),
        movie({ action: 'watchlist', watched_at: undefined }),
        movie({ year: 1968 }),
      ],
      match,
    });

    expect(match).toHaveBeenCalledTimes(1);
    expect(match).toHaveBeenCalledWith([
      { index: 0, title: 'split', year: 2016 },
      { index: 1, title: 'split', year: 1968 },
    ]);
    expect(items[0]?.ids.trakt).toBe(247643);
    expect(items[1]?.ids.trakt).toBe(247643);
    expect(items[2]?.ids.trakt).toBe(1968);
  });

  it('should report progress per batch resolved', async () => {
    const match = vi.fn().mockResolvedValue([
      matched(0, {
        title: 'Split',
        year: 2016,
        score: 2582,
        ids: { trakt: 247643, imdb: 'tt3315656', tmdb: 358364 },
      }),
    ]);
    const onProgress = vi.fn();

    await resolveMovieIds({ items: [movie()], match, onProgress });

    expect(onProgress).toHaveBeenNthCalledWith(1, 0, 1);
    expect(onProgress).toHaveBeenNthCalledWith(2, 1, 1);
  });

  it('should report a total of 0 when nothing needs resolution', async () => {
    const match = vi.fn().mockResolvedValue([]);
    const onProgress = vi.fn();

    await resolveMovieIds({
      items: [movie({ ids: { imdb: 'tt4972582' } })],
      match,
      onProgress,
    });

    expect(onProgress).toHaveBeenCalledWith(0, 0);
    expect(onProgress).toHaveBeenCalledTimes(1);
  });

  it('should not call match when the signal is already aborted', async () => {
    const match = vi.fn();
    const controller = new AbortController();
    controller.abort();

    const { items } = await resolveMovieIds({
      items: [movie()],
      match,
      signal: controller.signal,
    });

    expect(match).not.toHaveBeenCalled();
    expect(items[0]?.ids).toEqual({});
  });
});
