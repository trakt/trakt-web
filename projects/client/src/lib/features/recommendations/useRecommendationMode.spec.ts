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

function mockDirector(isDirector: boolean) {
  const user = deepAssign(clone(ExtendedUsersResponseMock), {
    user: { director: isDirector },
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

  it('should request smart by default for directors', async () => {
    mockDirector(true);

    const { requestMode } = await renderStore(() => useRecommendationMode());

    expect(await waitForValue(requestMode, 'smart')).toBe('smart');
  });

  it('should request no mode for everyone else', async () => {
    mockDirector(false);

    const { requestMode, isApplicable } = await renderStore(() =>
      useRecommendationMode(),
    );

    expect(await waitForValue(isApplicable, false)).toBe(false);
    expect(await waitForValue(requestMode, undefined)).toBeUndefined();
  });

  it('should request classic after a director switches to it', async () => {
    mockDirector(true);

    const { requestMode, onModeChange } = await renderStore(() =>
      useRecommendationMode(),
    );
    onModeChange('classic');

    expect(await waitForValue(requestMode, 'classic')).toBe('classic');
  });
});
