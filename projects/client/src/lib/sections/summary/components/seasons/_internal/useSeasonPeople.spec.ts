import { EpisodeSiloResponseMock } from '$mocks/data/summary/episodes/silo/response/EpisodeSiloResponseMock.ts';
import { ShowSiloSplitPeopleMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloSplitPeopleMappedMock.ts';
import { ShowSiloResponseMock } from '$mocks/data/summary/shows/silo/response/ShowSiloResponseMock.ts';
import { renderStore } from '$test/beds/store/renderStore.ts';
import { valueObservable } from '$test/beds/store/valueObservable.ts';
import { filter, firstValueFrom } from 'rxjs';
import { expect, it } from 'vitest';
import { useSeasonPeople } from './useSeasonPeople.ts';

it('should load split season credits with guest stars', async () => {
  const { crew } = await renderStore(() =>
    useSeasonPeople(valueObservable({
      slug: ShowSiloResponseMock.ids.slug,
      season: EpisodeSiloResponseMock.season,
    }))
  );

  const split = await firstValueFrom(
    crew.pipe(filter((value) => value.guestStars.length > 0)),
  );
  expect(split).toEqual(ShowSiloSplitPeopleMappedMock);
});
