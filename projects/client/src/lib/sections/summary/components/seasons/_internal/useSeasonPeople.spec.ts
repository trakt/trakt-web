import { FeatureFlag } from '$lib/features/feature-flag/models/FeatureFlag.ts';
import { useFeatureFlag } from '$lib/features/feature-flag/useFeatureFlag.ts';
import { EpisodeSiloResponseMock } from '$mocks/data/summary/episodes/silo/response/EpisodeSiloResponseMock.ts';
import { ShowSiloPeopleMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloPeopleMappedMock.ts';
import { ShowSiloSplitPeopleMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloSplitPeopleMappedMock.ts';
import { ShowSiloResponseMock } from '$mocks/data/summary/shows/silo/response/ShowSiloResponseMock.ts';
import { renderStore, setAuthorization } from '$test/beds/store/renderStore.ts';
import { valueObservable } from '$test/beds/store/valueObservable.ts';
import { filter, firstValueFrom } from 'rxjs';
import { afterEach, expect, it } from 'vitest';
import { useSeasonPeople } from './useSeasonPeople.ts';

afterEach(() => {
  setAuthorization(false);
  localStorage.removeItem('trakt-feature-flags');
});

it('should switch back to full season credits when the flag is disabled', async () => {
  setAuthorization(true);
  localStorage.setItem(
    'trakt-feature-flags',
    JSON.stringify({ 'split-cast': true }),
  );
  const { crew, setFlag } = await renderStore(() => ({
    ...useFeatureFlag(),
    ...useSeasonPeople(valueObservable({
      slug: ShowSiloResponseMock.ids.slug,
      season: EpisodeSiloResponseMock.season,
    })),
  }));

  const split = await firstValueFrom(
    crew.pipe(filter((value) => value.guestStars.length > 0)),
  );
  expect(split).toEqual(ShowSiloSplitPeopleMappedMock);

  setFlag(FeatureFlag.SplitCast, false);
  const full = await firstValueFrom(
    crew.pipe(
      filter((value) => value.cast.length > 0 && value.guestStars.length === 0),
    ),
  );
  expect(full).toEqual(ShowSiloPeopleMappedMock);
});
