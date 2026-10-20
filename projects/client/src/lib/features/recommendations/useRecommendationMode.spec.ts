import { resetGlobalStore } from '$lib/components/toggles/useToggler.ts';
import { clone } from '$lib/utils/object/clone.ts';
import { deepAssign } from '$lib/utils/object/deepAssign.ts';
import { ExtendedUsersResponseMock } from '$mocks/data/users/response/ExtendedUserSettingsResponseMock.ts';
import { server } from '$mocks/server.ts';
import { renderStore, setAuthorization } from '$test/beds/store/renderStore.ts';
import { waitForValue } from '$test/readable/waitForValue.ts';
import { http, HttpResponse } from 'msw';
import { beforeEach, describe, expect, it } from 'vitest';
import { useRecommendationMode } from './useRecommendationMode.ts';

function mockUser({ vip, director }: { vip: boolean; director: boolean }) {
  const user = deepAssign(clone(ExtendedUsersResponseMock), {
    user: { vip, vip_ep: vip, director },
  });

  server.use(
    http.get('http://localhost/users/settings', () => HttpResponse.json(user)),
  );
}

describe('store: useRecommendationMode', () => {
  beforeEach(() => {
    localStorage.clear();
    resetGlobalStore();
    setAuthorization(true);
  });

  it('should request smart by default for VIPs', async () => {
    mockUser({ vip: true, director: false });

    const { requestMode } = await renderStore(() => useRecommendationMode());

    expect(await waitForValue(requestMode, 'smart')).toBe('smart');
  });

  it('should request smart by default for directors', async () => {
    mockUser({ vip: false, director: true });

    const { requestMode } = await renderStore(() => useRecommendationMode());

    expect(await waitForValue(requestMode, 'smart')).toBe('smart');
  });

  it('should request no mode for free users', async () => {
    mockUser({ vip: false, director: false });

    const { requestMode, isApplicable } = await renderStore(() =>
      useRecommendationMode(),
    );

    expect(await waitForValue(isApplicable, false)).toBe(false);
    expect(await waitForValue(requestMode, undefined)).toBeUndefined();
  });

  it('should request classic after a VIP switches to it', async () => {
    mockUser({ vip: true, director: false });

    const { requestMode, onModeChange } = await renderStore(() =>
      useRecommendationMode(),
    );
    onModeChange('classic');

    expect(await waitForValue(requestMode, 'classic')).toBe('classic');
  });
});
