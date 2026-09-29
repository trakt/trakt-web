import type { UserHistory } from '$lib/features/auth/stores/useCurrentUserHistory.ts';
import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { MovieHereticMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticMappedMock.ts';
import { ShowSiloMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloMappedMock.ts';
import { WatchedMoviesMappedMock } from '$mocks/data/users/mapped/WatchedMoviesMappedMock.ts';
import { WatchedShowsMappedMock } from '$mocks/data/users/mapped/WatchedShowsMappedMock.ts';
import { describe, expect, it } from 'vitest';
import { hasWatchedToo } from './hasWatchedToo.ts';

const watchedMovie = assertDefined(WatchedMoviesMappedMock.at(0));
const watchedShow = assertDefined(WatchedShowsMappedMock.at(0));

const history: UserHistory = {
  movies: new Map([[watchedMovie.id, watchedMovie]]),
  shows: new Map([[watchedShow.id, watchedShow]]),
};

const movie = { ...MovieHereticMappedMock, id: watchedMovie.id };
const show = { ...ShowSiloMappedMock, id: watchedShow.id };

describe('util: hasWatchedToo', () => {
  it('should be false until the history is loaded', () => {
    expect(hasWatchedToo({ history: null, media: movie })).toBe(false);
  });

  it('should be true for a movie the user watched', () => {
    expect(hasWatchedToo({ history, media: movie })).toBe(true);
  });

  it('should be false for a movie the user has not watched', () => {
    expect(hasWatchedToo({ history, media: { ...movie, id: 1 } })).toBe(false);
  });

  it('should be true for a show the user has started', () => {
    expect(hasWatchedToo({ history, media: show })).toBe(true);
  });

  it('should be false for a show the user never watched', () => {
    expect(hasWatchedToo({ history, media: { ...show, id: 2 } })).toBe(false);
  });

  it('should be false for a show without any watched episode', () => {
    const empty = { ...watchedShow, episodes: [] };

    expect(
      hasWatchedToo({
        history: { ...history, shows: new Map([[watchedShow.id, empty]]) },
        media: show,
      }),
    ).toBe(false);
  });
});
