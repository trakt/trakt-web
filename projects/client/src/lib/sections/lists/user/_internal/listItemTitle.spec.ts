import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { ListedMoviesMappedMock } from '$mocks/data/lists/mapped/ListedMoviesMappedMock.ts';
import { ListedShowsMappedMock } from '$mocks/data/lists/mapped/ListedShowsMappedMock.ts';
import { describe, expect, it } from 'vitest';
import { listItemTitle } from './listItemTitle.ts';

describe('util: listItemTitle', () => {
  it('should return the entry title for a movie', () => {
    const movie = assertDefined(ListedMoviesMappedMock.at(0));
    expect(listItemTitle(movie)).toBe(
      movie.type === 'movie' ? movie.entry.title : undefined,
    );
  });

  it('should return the entry title for a show', () => {
    const show = assertDefined(ListedShowsMappedMock.at(0));
    expect(listItemTitle(show)).toBe(
      show.type === 'show' ? show.entry.title : undefined,
    );
  });
});
