import { MovieHereticResponseMock } from '$mocks/data/summary/movies/heretic/response/MovieHereticResponseMock.ts';
import { ShowSiloResponseMock } from '$mocks/data/summary/shows/silo/response/ShowSiloResponseMock.ts';
import { renderStore } from '$test/beds/store/renderStore.ts';
import { waitForEmission } from '$test/readable/waitForEmission.ts';
import { describe, expect, it } from 'vitest';
import { useSearch } from './useSearch.ts';

describe('useSearch', () => {
  it('should initialize with empty results', async () => {
    const { results } = await renderStore(() => useSearch());

    expect(await waitForEmission(results, 1)).toEqual(null);
  });

  it('should return empty results when search term is empty', async () => {
    const { search, results } = await renderStore(() => useSearch());

    await search('', 'media');
    expect(await waitForEmission(results, 1)).toEqual(null);
  });

  it('should return empty results when search string is full of whitespaces', async () => {
    const { search, results } = await renderStore(() => useSearch());

    await search('      ', 'media');
    expect(await waitForEmission(results, 1)).toEqual(null);
  });

  it('should include trending entries of every type in media mode', async () => {
    const { search, results } = await renderStore(() => useSearch());

    search(MovieHereticResponseMock.title, 'media');
    // Emission 1 is the intl overlay's empty first pass; 2 carries the items.
    const response = await waitForEmission(results, 2);

    expect(response?.items.map((item) => item.slug)).toContain(
      ShowSiloResponseMock.ids.slug,
    );
  });

  it('should exclude trending entries of other types when a typed mode is active', async () => {
    const { search, results } = await renderStore(() => useSearch());

    search(MovieHereticResponseMock.title, 'movie');
    const response = await waitForEmission(results, 2);
    const items = response?.type === 'media' ? response.items : [];

    expect(items.map((item) => item.slug)).toContain(
      MovieHereticResponseMock.ids.slug,
    );
    expect(items.every((item) => item.type === 'movie')).toBe(true);
  });

  /**
   * TODO: add more scenarios here once I figure out the AbortSignal error in testing
   */
});
