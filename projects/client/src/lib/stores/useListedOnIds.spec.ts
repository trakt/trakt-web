import type { MediaEntry } from '$lib/requests/models/MediaEntry.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';
import { UserMovieListIdsResponseMock } from '$mocks/data/lists/response/UserMovieListIdsResponseMock.ts';
import { UserShowListIdsResponseMock } from '$mocks/data/lists/response/UserShowListIdsResponseMock.ts';
import { MovieHereticMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticMappedMock.ts';
import { ShowSiloMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloMappedMock.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { valueObservable } from '$test/beds/store/valueObservable.ts';
import { BehaviorSubject } from 'rxjs';
import { describe, expect, it } from 'vitest';
import { useListedOnIds } from './useListedOnIds.ts';

describe('store: useListedOnIds', () => {
  it.each<[MediaType, MediaEntry, number[]]>([
    ['movie', MovieHereticMappedMock, UserMovieListIdsResponseMock],
    ['show', ShowSiloMappedMock, UserShowListIdsResponseMock],
  ])(
    'should resolve the list ids a %s is on',
    async (_type, media, expected) => {
      const listedOnIds = await runQuery({
        factory: () =>
          useListedOnIds({ media$: valueObservable(media) }).listedOnIds,
        waitFor: (ids) => ids.length > 0,
      });

      expect(listedOnIds).to.deep.equal(expected);
    },
  );

  it('should re-key the query when the media observable emits', async () => {
    const media$ = new BehaviorSubject<MediaEntry>(MovieHereticMappedMock);

    const listedOnIds = runQuery({
      factory: () => useListedOnIds({ media$ }).listedOnIds,
      waitFor: (ids) =>
        ids.length > 0 &&
        ids.every((id) => UserShowListIdsResponseMock.includes(id)),
    });

    media$.next(ShowSiloMappedMock);

    expect(await listedOnIds).to.deep.equal(UserShowListIdsResponseMock);
  });
});
