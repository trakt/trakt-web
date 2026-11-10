import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { MovieHereticMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticMappedMock.ts';
import { MovieMatrixMappedMock } from '$mocks/data/summary/movies/matrix/MovieMatrixMappedMock.ts';
import { ShowSiloSeasonsMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloSeasonsMappedMock.ts';
import { captureInvalidations } from '$test/beds/query/captureInvalidations.ts';
import { renderStore, setAuthorization } from '$test/beds/store/renderStore.ts';
import { waitForEmission } from '$test/readable/waitForEmission.ts';
import { waitForValue } from '$test/readable/waitForValue.ts';
import { combineLatest, firstValueFrom, map } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useUser } from '$lib/features/auth/stores/useUser.ts';
import { offlineActionsStore } from '$lib/features/offline/_internal/offlineActionsStore.ts';
import { toMediaKey } from '$lib/features/offline/toMediaKey.ts';
import { server } from '$mocks/server.ts';
import { buildOfflineAction } from '$test/beds/offline/buildOfflineAction.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { http, HttpResponse } from 'msw';
import { useRatings } from './useRatings.ts';

function currentOnceLoaded(props: Parameters<typeof useRatings>[0]) {
  const { current } = useRatings(props);
  const { ratings, favorites } = useUser();

  return combineLatest([current, ratings, favorites]).pipe(
    map(([$current, $ratings, $favorites]) => ({
      current: $current,
      isLoaded:
        ($ratings?.movies.size ?? 0) > 0 && ($favorites?.movies.size ?? 0) > 0,
    })),
  );
}

const RATED_MOVIE_ID = 916302;
const RATED_SHOW_ID = 180770;
const UNRATED_MOVIE_ID = 1;

const ADD_URL = 'http://localhost/sync/ratings';
const REMOVE_URL = 'http://localhost/sync/ratings/remove';

async function drainQueue() {
  const ids = offlineActionsStore.current().map(({ id }) => id);
  await offlineActionsStore.remove(ids);
}

function captureBodies(url: string) {
  const bodies: unknown[] = [];
  server.use(
    http.post(url, async ({ request }) => {
      bodies.push(await request.json());
      return new HttpResponse(null, { status: 201 });
    }),
  );

  return bodies;
}

describe('useRatings', () => {
  beforeEach(() => {
    setAuthorization(true);
  });

  it('should indicate while rating is in progress', async () => {
    const { pendingRating, addRating } = await renderStore(() =>
      useRatings({
        type: 'movie',
        id: MovieHereticMappedMock.id,
      }),
    );

    addRating(2);
    expect(await firstValueFrom(pendingRating)).toBe(2);
  });

  it('should not indicate that rating is in progress', async () => {
    const { pendingRating } = await renderStore(() =>
      useRatings({
        type: 'movie',
        id: MovieHereticMappedMock.id,
      }),
    );

    expect(await firstValueFrom(pendingRating)).toBe(null);
  });

  it('should return the current rating', async () => {
    const { current } = await renderStore(() =>
      useRatings({
        type: 'movie',
        id: MovieHereticMappedMock.id,
      }),
    );

    const value = await waitForValue(current, {
      rating: 10,
      isFavorited: false,
    });
    expect(value?.rating).toBe(10);
  });

  it('should return the current season rating', async () => {
    const season = assertDefined(ShowSiloSeasonsMappedMock.at(0));

    const { current } = await renderStore(() =>
      useRatings({
        type: 'season',
        id: season.id,
      }),
    );

    const value = await waitForValue(current, {
      rating: 8,
      isFavorited: false,
    });
    expect(value?.rating).toBe(8);
  });

  it('should return undefined if there is no current rating', async () => {
    const { current } = await renderStore(() =>
      useRatings({
        type: 'movie',
        id: MovieMatrixMappedMock.id,
      }),
    );

    const value = await waitForEmission(current, 2);
    expect(value).toBeUndefined();
  });

  it('should call invalidate after rating', async () => {
    const { addRating } = await renderStore(() =>
      useRatings({
        type: 'movie',
        id: MovieMatrixMappedMock.id,
      }),
    );

    const invalidations = await captureInvalidations(async () => {
      vi.useFakeTimers();
      addRating(2);
      await vi.advanceTimersByTimeAsync(500);
      vi.useRealTimers();
    });

    expect(invalidations).toContain(InvalidateAction.Rated('movie'));
    expect(invalidations).not.toContain(InvalidateAction.Favorited('movie'));
  });

  it('should call invalidate after rating a season', async () => {
    const season = assertDefined(ShowSiloSeasonsMappedMock.at(1));

    const { addRating } = await renderStore(() =>
      useRatings({
        type: 'season',
        id: season.id,
      }),
    );

    const invalidations = await captureInvalidations(async () => {
      vi.useFakeTimers();
      addRating(6);
      await vi.advanceTimersByTimeAsync(500);
      vi.useRealTimers();
    });

    expect(invalidations).toContain(InvalidateAction.Rated('season'));
  });

  describe('current', () => {
    afterEach(drainQueue);

    it('should expose the rating of a rated show', async () => {
      const result = await runQuery({
        factory: () => useRatings({ type: 'show', id: RATED_SHOW_ID }).current,
        waitFor: (value) => value != null,
      });

      expect(result?.rating).to.equal(9);
    });

    it('should prefer a queued rating over the synced one', async () => {
      await offlineActionsStore.enqueue(
        buildOfflineAction({
          endpoint: 'rating:add',
          keys: [toMediaKey('movie', RATED_MOVIE_ID)],
          body: { movies: [{ ids: { trakt: RATED_MOVIE_ID }, rating: 3 }] },
        }),
      );

      const result = await runQuery({
        factory: () =>
          useRatings({ type: 'movie', id: RATED_MOVIE_ID }).current,
        waitFor: (value) => value?.rating === 3,
      });

      expect(result?.rating).to.equal(3);
    });

    it('should ignore a queued removal when reading the rating', async () => {
      await offlineActionsStore.enqueue(
        buildOfflineAction({
          endpoint: 'rating:remove',
          keys: [toMediaKey('movie', RATED_MOVIE_ID)],
          body: { movies: [{ ids: { trakt: RATED_MOVIE_ID } }] },
        }),
      );

      const { current } = await runQuery({
        factory: () => currentOnceLoaded({ type: 'movie', id: RATED_MOVIE_ID }),
        waitFor: (value) => value.isLoaded,
      });
      expect(current).to.equal(undefined);
    });
  });

  describe('addRating', () => {
    afterEach(drainQueue);

    it('should post the rating once after the debounce', async () => {
      const bodies = captureBodies(ADD_URL);
      const { addRating } = await renderStore(() =>
        useRatings({ type: 'movie', id: UNRATED_MOVIE_ID }),
      );

      addRating(4);
      addRating(8);

      await vi.waitFor(
        () =>
          expect(bodies).toContainEqual({
            movies: [{ ids: { trakt: UNRATED_MOVIE_ID }, rating: 8 }],
          }),
        { timeout: 3000 },
      );
      expect(bodies).not.toContainEqual({
        movies: [{ ids: { trakt: UNRATED_MOVIE_ID }, rating: 4 }],
      });
    });

    it('should release the pending rating once the post settles', async () => {
      captureBodies(ADD_URL);
      const { addRating, pendingRating } = await renderStore(() =>
        useRatings({ type: 'show', id: UNRATED_MOVIE_ID }),
      );

      addRating(6);

      await vi.waitFor(
        async () => expect(await firstValueFrom(pendingRating)).to.equal(null),
        { timeout: 3000 },
      );
    });

    it('should queue the rating and release the pending state when offline', async () => {
      server.use(http.post(ADD_URL, () => HttpResponse.error()));
      const { addRating, pendingRating } = await renderStore(() =>
        useRatings({ type: 'movie', id: UNRATED_MOVIE_ID }),
      );

      addRating(7);

      await vi.waitFor(
        () => expect(offlineActionsStore.current()).to.have.length(1),
        {
          timeout: 3000,
        },
      );
      await vi.waitFor(
        async () => expect(await firstValueFrom(pendingRating)).to.equal(null),
        { timeout: 3000 },
      );
      expect(offlineActionsStore.current().at(0)?.endpoint).to.equal(
        'rating:add',
      );
    });
  });

  describe('removeRating', () => {
    it('should post the removal for the media', async () => {
      const bodies = captureBodies(REMOVE_URL);
      const { removeRating } = await renderStore(() =>
        useRatings({ type: 'movie', id: RATED_MOVIE_ID }),
      );

      await removeRating();

      expect(bodies).to.deep.equal([
        { movies: [{ ids: { trakt: RATED_MOVIE_ID } }] },
      ]);
    });

    it('should invalidate ratings after removing a rating', async () => {
      captureBodies(REMOVE_URL);
      const { removeRating } = await renderStore(() =>
        useRatings({ type: 'movie', id: RATED_MOVIE_ID }),
      );

      const invalidations = await captureInvalidations(removeRating);

      expect(invalidations).toContain(InvalidateAction.Rated('movie'));
    });

    it('should drop a rating that is still waiting for the debounce', async () => {
      const addBodies = captureBodies(ADD_URL);
      captureBodies(REMOVE_URL);
      const { addRating, removeRating } = await renderStore(() =>
        useRatings({ type: 'movie', id: RATED_MOVIE_ID }),
      );

      vi.useFakeTimers();
      try {
        addRating(2);
        await removeRating();
        await vi.advanceTimersByTimeAsync(800);
      } finally {
        vi.useRealTimers();
      }

      expect(addBodies).to.deep.equal([]);
    });

    it('should release the pending state once removed', async () => {
      captureBodies(REMOVE_URL);
      const { removeRating, pendingRating } = await renderStore(() =>
        useRatings({ type: 'movie', id: RATED_MOVIE_ID }),
      );

      await removeRating();

      expect(await firstValueFrom(pendingRating)).to.equal(null);
    });
  });
});
