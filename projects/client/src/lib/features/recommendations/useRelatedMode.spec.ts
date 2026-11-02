import { resetGlobalStore } from '$lib/components/toggles/useToggler.ts';
import { clone } from '$lib/utils/object/clone.ts';
import { deepAssign } from '$lib/utils/object/deepAssign.ts';
import { ExtendedUsersResponseMock } from '$mocks/data/users/response/ExtendedUserSettingsResponseMock.ts';
import { server } from '$mocks/server.ts';
import { renderStore, setAuthorization } from '$test/beds/store/renderStore.ts';
import { waitForValue } from '$test/readable/waitForValue.ts';
import { http, HttpResponse } from 'msw';
import { beforeEach, describe, expect, it } from 'vitest';
import { useRelatedMode } from './useRelatedMode.ts';

function mockUser({ vip, director }: { vip: boolean; director: boolean }) {
  const user = deepAssign(clone(ExtendedUsersResponseMock), {
    user: { vip, vip_ep: vip, director },
  });

  server.use(
    http.get('http://localhost/users/settings', () => HttpResponse.json(user)),
  );
}

describe('store: useRelatedMode', () => {
  beforeEach(() => {
    localStorage.clear();
    resetGlobalStore();
    setAuthorization(true);
  });

  it('should personalize by default for directors', async () => {
    mockUser({ vip: false, director: true });

    const { isPersonalized } = await renderStore(() => useRelatedMode());

    expect(await waitForValue(isPersonalized, true)).toBe(true);
  });

  it('should not personalize for VIPs while the flag is director only', async () => {
    mockUser({ vip: true, director: false });

    const { isPersonalized } = await renderStore(() => useRelatedMode());

    expect(await waitForValue(isPersonalized, false)).toBe(false);
  });

  it('should not personalize for free users', async () => {
    mockUser({ vip: false, director: false });

    const { isPersonalized } = await renderStore(() => useRelatedMode());

    expect(await waitForValue(isPersonalized, false)).toBe(false);
  });

  it('should stop personalizing after a director switches to standard', async () => {
    mockUser({ vip: false, director: true });

    const { isPersonalized, onModeChange } = await renderStore(() =>
      useRelatedMode(),
    );
    onModeChange('standard');

    expect(await waitForValue(isPersonalized, false)).toBe(false);
  });
});
