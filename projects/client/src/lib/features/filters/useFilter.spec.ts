import { useUser } from '$lib/features/auth/stores/useUser.ts';
import { useParameters } from '$lib/features/parameters/useParameters.ts';
import { useNavbarState } from '$lib/sections/navbar/useNavbarState.ts';
import { ExtendedUsersResponseMock } from '$mocks/data/users/response/ExtendedUserSettingsResponseMock.ts';
import { server } from '$mocks/server.ts';
import { renderStore, setAuthorization } from '$test/beds/store/renderStore.ts';
import { http, HttpResponse } from 'msw';
import { filter, firstValueFrom } from 'rxjs';
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

  it.each([true, false])(
    'should apply and count ranges when VIP is %s',
    async (isVip) => {
      const stores = await setup(isVip);

      expect(await firstValueFrom(stores.filterMap)).toEqual(ranges);
      expect(await firstValueFrom(stores.activeFilterCount)).toBe(5);
      expect(await firstValueFrom(stores.hasActiveFilter)).toBe(true);
      expect(await firstValueFrom(stores.isFiltered)).toBe(true);
      expect(await firstValueFrom(stores.hasAnyAdvancedFilter)).toBe(true);
    },
  );
});
