import { MovieLorePublicMappedMock } from '$mocks/data/summary/movie-lore/mapped/MovieLorePublicMappedMock.ts';
import { MovieLoreVipMappedMock } from '$mocks/data/summary/movie-lore/mapped/MovieLoreVipMappedMock.ts';
import { MovieLorePublicResponseMock } from '$mocks/data/summary/movie-lore/response/MovieLorePublicResponseMock.ts';
import { MovieLoreVipResponseMock } from '$mocks/data/summary/movie-lore/response/MovieLoreVipResponseMock.ts';
import { describe, expect, it } from 'vitest';
import { mapToMovieLore } from './mapToMovieLore.ts';

describe('mapper: mapToMovieLore', () => {
  it('should map the full lore with relative person links', () => {
    expect(mapToMovieLore(MovieLoreVipResponseMock)).to.deep.equal(
      MovieLoreVipMappedMock,
    );
  });

  it('should map the free shape to empty lore and the locked counts', () => {
    expect(mapToMovieLore(MovieLorePublicResponseMock)).to.deep.equal(
      MovieLorePublicMappedMock,
    );
  });

  it('should leave a film without a poster or year blank', () => {
    const movie = { id: 1, slug: 'x', title: 'X' };
    const mapped = mapToMovieLore({
      ...MovieLorePublicResponseMock,
      watchFirst: null,
      earlier: [movie],
    });

    expect(mapped?.earlier).to.deep.equal([
      { id: 1, slug: 'x', title: 'X', year: null, poster: null },
    ]);
  });

  it('should map to nothing without a response', () => {
    expect(mapToMovieLore(undefined)).toBeNull();
  });
});
