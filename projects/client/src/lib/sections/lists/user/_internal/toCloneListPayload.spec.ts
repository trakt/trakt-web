import type { ListItem } from '$lib/requests/models/ListItem.ts';
import { ListedMoviesMappedMock } from '$mocks/data/lists/mapped/ListedMoviesMappedMock.ts';
import { ListedShowsMappedMock } from '$mocks/data/lists/mapped/ListedShowsMappedMock.ts';
import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { describe, expect, it } from 'vitest';
import { toCloneListPayload } from './toCloneListPayload.ts';

describe('util: toCloneListPayload', () => {
  const movie = assertDefined(ListedMoviesMappedMock.at(0));
  const show = assertDefined(ListedShowsMappedMock.at(0));

  const movieId = movie.type === 'movie' ? movie.entry.id : 0;
  const showId = show.type === 'show' ? show.entry.id : 0;

  it('should group items under the bulk key of their media type', () => {
    const payload = toCloneListPayload([movie, show]);

    expect(payload).to.deep.equal({
      movies: [{ ids: { trakt: movieId } }],
      shows: [{ ids: { trakt: showId } }],
      seasons: [],
      episodes: [],
    });
  });

  it('should dedupe repeated entries of the same type', () => {
    const duplicate: ListItem = { ...movie, id: movie.id + 1 };

    expect(toCloneListPayload([movie, duplicate]).movies).to.deep.equal([
      { ids: { trakt: movieId } },
    ]);
  });

  it('should return empty buckets for an empty list', () => {
    expect(toCloneListPayload([])).to.deep.equal({
      movies: [],
      shows: [],
      seasons: [],
      episodes: [],
    });
  });
});
