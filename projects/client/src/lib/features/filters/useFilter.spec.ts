import { useUser } from '$lib/features/auth/stores/useUser.ts';
import { FeatureFlag } from '$lib/features/feature-flag/models/FeatureFlag.ts';
import { useFeatureFlag } from '$lib/features/feature-flag/useFeatureFlag.ts';
import { useParameters } from '$lib/features/parameters/useParameters.ts';
import { useNavbarState } from '$lib/sections/navbar/useNavbarState.ts';
import { ExtendedUsersResponseMock } from '$mocks/data/users/response/ExtendedUserSettingsResponseMock.ts';
import { server } from '$mocks/server.ts';
import { renderStore, setAuthorization } from '$test/beds/store/renderStore.ts';
import { waitFor } from '@testing-library/svelte';
import { http, HttpResponse } from 'msw';
import { combineLatest, filter, firstValueFrom } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { useFilter } from './useFilter.ts';
import { useStoredFilters } from './useStoredFilters.ts';

const ranges = {
  parental_nudity: '0-0',
  parental_violence: '0-1',
  parental_profanity: '1-2',
  parental_alcohol: '2-3',
  parental_frightening: '3-3',
};

async function setup(isVip = true) {
  server.use(
    http.get('http://localhost/users/settings', () =>
      HttpResponse.json({
        ...ExtendedUsersResponseMock,
        user: {
          ...ExtendedUsersResponseMock.user,
          vip: isVip,
          vip_ep: false,
          director: false,
        },
      })),
  );
  const stores = await renderStore(() => {
    const parameters = useParameters();
    const stored = useStoredFilters();
    parameters.update({});
    stored.saveFilters();
    parameters.update(ranges);
    return {
      ...useFilter(),
      ...useFeatureFlag(),
      ...useUser(),
      parameters,
      stored,
    };
  });
  await firstValueFrom(
    stores.user.pipe(
      filter((user) => Boolean(user.slug) && user.isVip === isVip),
    ),
  );
  return stores;
}

describe('store: useFilter parental availability', () => {
  beforeEach(() => {
    localStorage.clear();
    setAuthorization(true);
    useNavbarState().set({ hasFilters: true });
  });

  afterEach(() => useNavbarState().reset());

  it('should stop applying and counting ranges when disabled and restore them when enabled', async () => {
    const stores = await setup();
    const emissions: unknown[] = [];
    const subscription = combineLatest([
      stores.filterMap,
      stores.activeFilterCount,
      stores.hasActiveFilter,
      stores.isFiltered,
      stores.hasAnyAdvancedFilter,
    ]).subscribe((value) => emissions.push(value));

    try {
      stores.setFlag(FeatureFlag.ParentalGuide, true);
      await waitFor(() =>
        expect(emissions.at(-1)).toEqual([ranges, 5, true, true, true])
      );

      stores.setFlag(FeatureFlag.ParentalGuide, false);
      await waitFor(() =>
        expect(emissions.at(-1)).toEqual([{}, 0, false, false, false])
      );
      expect(Object.fromEntries(await firstValueFrom(stores.parameters.search)))
        .toEqual(ranges);

      stores.setFlag(FeatureFlag.ParentalGuide, true);
      await waitFor(() =>
        expect(emissions.at(-1)).toEqual([ranges, 5, true, true, true])
      );
    } finally {
      subscription.unsubscribe();
    }
  });

  it('should ignore saved parental defaults while preserving ordinary filters', async () => {
    const stores = await setup();
    stores.setFlag(FeatureFlag.ParentalGuide, true);
    stores.stored.saveFilters();
    stores.parameters.update({ genres: 'action' });
    stores.setFlag(FeatureFlag.ParentalGuide, false);

    expect(await firstValueFrom(stores.filterMap)).toEqual({
      genres: 'action',
    });
    expect(await firstValueFrom(stores.activeFilterCount)).toBe(1);
    stores.parameters.update({});
    expect(await firstValueFrom(stores.hasActiveFilter)).toBe(false);
    expect(await firstValueFrom(stores.stored.storedFilters)).toEqual(ranges);
  });

  it('should ignore ranges for a non-VIP even when the flag is enabled', async () => {
    const stores = await setup(false);
    stores.setFlag(FeatureFlag.ParentalGuide, true);
    expect(await firstValueFrom(stores.filterMap)).toEqual({});
    expect(await firstValueFrom(stores.isFiltered)).toBe(false);
  });
});
