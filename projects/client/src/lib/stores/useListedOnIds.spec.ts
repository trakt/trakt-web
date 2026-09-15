import type { ListTarget } from '$lib/models/ListTarget.ts';
import { UserEpisodeListIdsResponseMock } from '$mocks/data/lists/response/UserEpisodeListIdsResponseMock.ts';
import { UserMovieListIdsResponseMock } from '$mocks/data/lists/response/UserMovieListIdsResponseMock.ts';
import { UserSeasonListIdsResponseMock } from '$mocks/data/lists/response/UserSeasonListIdsResponseMock.ts';
import { UserShowListIdsResponseMock } from '$mocks/data/lists/response/UserShowListIdsResponseMock.ts';
import { EpisodeSiloMappedMock } from '$mocks/data/summary/episodes/silo/mapped/EpisodeSiloMappedMock.ts';
import { MovieHereticMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticMappedMock.ts';
import { ShowSiloMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloMappedMock.ts';
import { ShowSiloSeasonsMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloSeasonsMappedMock.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { valueObservable } from '$test/beds/store/valueObservable.ts';
import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { BehaviorSubject } from 'rxjs';
import { describe, expect, it } from 'vitest';
import { useListedOnIds } from './useListedOnIds.ts';

const movieTarget: ListTarget = {
  type: 'movie',
  media: MovieHereticMappedMock,
};
const showTarget: ListTarget = { type: 'show', media: ShowSiloMappedMock };
const seasonTarget: ListTarget = {
  type: 'season',
  media: assertDefined(ShowSiloSeasonsMappedMock.at(0)),
};
const episodeTarget: ListTarget = {
  type: 'episode',
  media: EpisodeSiloMappedMock,
};

describe('store: useListedOnIds', () => {
  it.each<[ListTarget['type'], ListTarget, number[]]>([
    ['movie', movieTarget, UserMovieListIdsResponseMock],
    ['show', showTarget, UserShowListIdsResponseMock],
    ['season', seasonTarget, UserSeasonListIdsResponseMock],
    ['episode', episodeTarget, UserEpisodeListIdsResponseMock],
  ])(
    'should resolve the list ids a %s is on',
    async (_type, target, expected) => {
      const listedOnIds = await runQuery({
        factory: () =>
          useListedOnIds({ target$: valueObservable(target) }).listedOnIds,
        waitFor: (ids) => ids.length > 0,
      });

      expect(listedOnIds).to.deep.equal(expected);
    },
  );

  it('should re-key the query when the target observable emits', async () => {
    const target$ = new BehaviorSubject<ListTarget>(movieTarget);

    const listedOnIds = runQuery({
      factory: () => useListedOnIds({ target$ }).listedOnIds,
      waitFor: (ids) =>
        ids.length > 0 &&
        ids.every((id) => UserShowListIdsResponseMock.includes(id)),
    });

    target$.next(showTarget);

    expect(await listedOnIds).to.deep.equal(UserShowListIdsResponseMock);
  });
});
