import { MovieHereticMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticMappedMock.ts';
import { describe, expect, it } from 'vitest';
import { toGameTitles } from './toGameTitles.ts';

describe('util: toGameTitles', () => {
  it('should map an entry to a game title with a whole percentage', () => {
    const [title] = toGameTitles([MovieHereticMappedMock]);

    expect(title).toEqual({
      key: 'movie-916302',
      title: 'Heretic',
      type: 'movie',
      year: 2024,
      rating: 72,
      poster: MovieHereticMappedMock.poster.url.medium,
    });
  });

  it('should drop entries without a rating', () => {
    expect(toGameTitles([{ ...MovieHereticMappedMock, rating: null }]))
      .toHaveLength(0);
  });

  it('should drop entries with too few votes', () => {
    expect(toGameTitles([{ ...MovieHereticMappedMock, votes: 12 }]))
      .toHaveLength(0);
  });
});
