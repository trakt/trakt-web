import { useUser } from '$lib/features/auth/stores/useUser.ts';
import { ExtendedUsersResponseMock } from '$mocks/data/users/response/ExtendedUserSettingsResponseMock.ts';
import { server } from '$mocks/server.ts';
import { renderStore, setAuthorization } from '$test/beds/store/renderStore.ts';
import { http, HttpResponse } from 'msw';
import { filter, firstValueFrom } from 'rxjs';
import { afterEach, expect, it } from 'vitest';
import { FeatureFlag } from './models/FeatureFlag.ts';
import { useFeatureFlag } from './useFeatureFlag.ts';
import { useSplitCast } from './useSplitCast.ts';

afterEach(() => {
  setAuthorization(false);
  localStorage.clear();
});

it.each([true, false])(
  'requires VIP access when the split-cast flag is enabled (VIP=%s)',
  async (vip) => {
    localStorage.setItem(
      'trakt-feature-flags',
      JSON.stringify({ 'split-cast': true }),
    );
    setAuthorization(true);
    server.use(
      http.get('http://localhost/users/settings', () =>
        HttpResponse.json({
          ...ExtendedUsersResponseMock,
          user: {
            ...ExtendedUsersResponseMock.user,
            vip,
            vip_ep: false,
            director: false,
          },
        })),
    );
    const stores = await renderStore(() => ({
      ...useUser(),
      ...useFeatureFlag(),
      enabled: useSplitCast(),
    }));
    await firstValueFrom(
      stores.user.pipe(
        filter((user) => Boolean(user.slug) && user.isVip === vip),
      ),
    );
    expect(await firstValueFrom(stores.enabled)).toBe(vip);
    stores.setFlag(FeatureFlag.SplitCast, false);
    expect(await firstValueFrom(stores.enabled)).toBe(false);
  },
);

it('disables the feature for anonymous visitors even with the flag enabled', async () => {
  setAuthorization(false);
  localStorage.setItem(
    'trakt-feature-flags',
    JSON.stringify({ 'split-cast': true }),
  );
  const enabled = await renderStore(() => useSplitCast());
  expect(await firstValueFrom(enabled)).toBe(false);
});
