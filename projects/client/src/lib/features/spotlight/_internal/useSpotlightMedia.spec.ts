import { MovieHereticResponseMock } from '$mocks/data/summary/movies/heretic/response/MovieHereticResponseMock.ts';
import { renderStore } from '$test/beds/store/renderStore.ts';
import { waitForEmission } from '$test/readable/waitForEmission.ts';
import { describe, expect, it } from 'vitest';
import { useSpotlightMedia } from './useSpotlightMedia.ts';

describe('store: useSpotlightMedia', () => {
  it('should start with no media', async () => {
    const { media } = await renderStore(() => useSpotlightMedia());

    expect(await waitForEmission(media, 1)).toEqual({ movies: [], shows: [] });
  });

  it('should resolve media for a search term', async () => {
    const { media, search } = await renderStore(() => useSpotlightMedia());

    search(MovieHereticResponseMock.title);
    const resolved = await waitForEmission(media, 3, 2000);

    expect(
      [...resolved.movies, ...resolved.shows].length,
    ).toBeGreaterThan(0);
  });

  it('should drop the previous media before the next request', async () => {
    const { media, search, isSearching } = await renderStore(() =>
      useSpotlightMedia()
    );

    search(MovieHereticResponseMock.title);
    const resolved = await waitForEmission(media, 3, 2000);
    expect([...resolved.movies, ...resolved.shows].length).toBeGreaterThan(0);

    // Editing the term must clear stale entries synchronously, otherwise the
    // palette can navigate to the previous query's result during the debounce.
    search('something else entirely');

    expect(await waitForEmission(media, 1)).toEqual({ movies: [], shows: [] });
    expect(isSearching.value).toBe(true);
  });
});
