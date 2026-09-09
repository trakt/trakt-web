import type { ListTarget } from '$lib/models/ListTarget.ts';
import type { UserList } from '$lib/requests/queries/users/userListsQuery.ts';
import { useListedOnIds } from '$lib/stores/useListedOnIds.ts';
import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { EpisodeSiloMappedMock } from '$mocks/data/summary/episodes/silo/mapped/EpisodeSiloMappedMock.ts';
import { ShowSiloSeasonsMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloSeasonsMappedMock.ts';
import { server } from '$mocks/server.ts';
import { renderStore, setAuthorization } from '$test/beds/store/renderStore.ts';
import { valueObservable } from '$test/beds/store/valueObservable.ts';
import { http, HttpResponse } from 'msw';
import { filter, firstValueFrom } from 'rxjs';
import { beforeEach, describe, expect, it } from 'vitest';
import { useList } from './useList.ts';

const LIST_ID = 37_255_911;

const list: UserList = {
  id: LIST_ID,
  name: 'Seasons and eps',
  count: 3,
  ownerId: 14_360_847,
};

const season = assertDefined(ShowSiloSeasonsMappedMock.at(0));

const targets: [string, string, ListTarget][] = [
  ['season', `http://localhost/v3/seasons/${season.id}/me/lists`, {
    type: 'season',
    media: season,
  }],
  [
    'episode',
    `http://localhost/v3/episodes/${EpisodeSiloMappedMock.id}/me/lists`,
    { type: 'episode', media: EpisodeSiloMappedMock },
  ],
];

describe('store: useList', () => {
  beforeEach(() => {
    setAuthorization(true);
  });

  it.each(targets)(
    'should reflect a %s as listed after adding it',
    async (_type, listedUrl, target) => {
      let isAdded = false;

      server.use(
        http.post(
          `http://localhost/users/${list.ownerId}/lists/${list.id}/items`,
          () => {
            isAdded = true;
            return HttpResponse.json({}, { status: 201 });
          },
        ),
        http.get(listedUrl, () => {
          return HttpResponse.json(isAdded ? [LIST_ID] : []);
        }),
      );

      const { listedOnIds, addToList } = await renderStore(() => ({
        ...useListedOnIds({ target$: valueObservable(target) }),
        ...useList({ list, ...target }),
      }));

      expect(await firstValueFrom(listedOnIds)).to.deep.equal([]);

      await addToList();

      const updated = await firstValueFrom(
        listedOnIds.pipe(filter((ids) => ids.length > 0)),
      );

      expect(updated).to.deep.equal([LIST_ID]);
    },
  );
});
