import { resetGlobalStore } from '$lib/components/toggles/useToggler.ts';
import { clone } from '$lib/utils/object/clone.ts';
import { deepAssign } from '$lib/utils/object/deepAssign.ts';
import { ExtendedUsersResponseMock } from '$mocks/data/users/response/ExtendedUserSettingsResponseMock.ts';
import { server } from '$mocks/server.ts';
import { renderStore, setAuthorization } from '$test/beds/store/renderStore.ts';
import { waitForValue } from '$test/readable/waitForValue.ts';
import { http, HttpResponse } from 'msw';
import { beforeEach, describe, expect, it } from 'vitest';
import { useRecommendedMode } from './useRecommendedMode.ts';

function mockUser({ vip, director }: { vip: boolean; director: boolean }) {
  const user = deepAssign(clone(ExtendedUsersResponseMock), {
    user: { vip, vip_ep: vip, director },
  });

  server.use(
    http.get('http://localhost/users/settings', () => HttpResponse.json(user)),
  );
}

describe('store: useRecommendedMode', () => {
  beforeEach(() => {
    localStorage.clear();
    resetGlobalStore();
    setAuthorization(true);
  });

  it('should not anticipate for VIPs while the flag is director only', async () => {
    mockUser({ vip: true, director: false });

    const { isAnticipated } = await renderStore(() => useRecommendedMode());

    expect(await waitForValue(isAnticipated, false)).toBe(false);
  });

  it('should not anticipate for free users', async () => {
    mockUser({ vip: false, director: false });

    const { isAnticipated } = await renderStore(() => useRecommendedMode());

    expect(await waitForValue(isAnticipated, false)).toBe(false);
  });

  it('should anticipate after a director switches to coming soon', async () => {
    mockUser({ vip: false, director: true });

    const { isAnticipated, onModeChange } = await renderStore(() =>
      useRecommendedMode(),
    );
    onModeChange('coming-soon');

    expect(await waitForValue(isAnticipated, true)).toBe(true);
  });

  it('should stop anticipating after a director switches back to out now', async () => {
    mockUser({ vip: false, director: true });

    const { isAnticipated, onModeChange } = await renderStore(() =>
      useRecommendedMode(),
    );
    onModeChange('coming-soon');
    await waitForValue(isAnticipated, true);
    onModeChange('out-now');

    expect(await waitForValue(isAnticipated, false)).toBe(false);
  });

  it('should not anticipate for free users who picked coming soon', async () => {
    mockUser({ vip: false, director: false });

    const { isAnticipated, onModeChange } = await renderStore(() =>
      useRecommendedMode(),
    );
    onModeChange('coming-soon');

    expect(await waitForValue(isAnticipated, false)).toBe(false);
  });
});
