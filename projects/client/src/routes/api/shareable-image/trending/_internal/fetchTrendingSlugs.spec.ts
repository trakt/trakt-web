import { MoviesTrendingResponseMock } from '$mocks/data/movies/response/MoviesTrendingResponseMock.ts';
import { ShowsTrendingResponseMock } from '$mocks/data/shows/response/ShowsTrendingResponseMock.ts';
import { describe, expect, it } from 'vitest';
import { fetchTrendingSlugs } from './fetchTrendingSlugs.ts';

describe('util: fetchTrendingSlugs', () => {
  it('should return the trending show slugs', async () => {
    const slugs = await fetchTrendingSlugs({ type: 'show' });

    expect(slugs).toEqual(
      ShowsTrendingResponseMock.map(({ show }) => show.ids.slug),
    );
  });

  it('should return the trending movie slugs', async () => {
    const slugs = await fetchTrendingSlugs({ type: 'movie' });

    expect(slugs).toEqual(
      MoviesTrendingResponseMock.map(({ movie }) => movie.ids.slug),
    );
  });
});
