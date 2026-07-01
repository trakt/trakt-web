import { clone } from '$lib/utils/object/clone.ts';
import { deepAssign } from '$lib/utils/object/deepAssign.ts';
import { ExtendedUsersResponseMock } from '$mocks/data/users/response/ExtendedUserSettingsResponseMock.ts';
import { server } from '$mocks/server.ts';
import { renderStore, setAuthorization } from '$test/beds/store/renderStore.ts';
import { waitForValue } from '$test/readable/waitForValue.ts';
import { http, HttpResponse } from 'msw';
import { beforeEach, describe, expect, it } from 'vitest';
import { FeatureFlag } from './models/FeatureFlag.ts';
import { useFeatureFlag } from './useFeatureFlag.ts';

function mockDirector(isDirector: boolean) {
  const user = deepAssign(
    clone(ExtendedUsersResponseMock),
    { user: { director: isDirector } },
  );

  server.use(
    http.get(
      'http://localhost/users/settings',
      () => HttpResponse.json(user),
    ),
  );
}

describe('store: useFeatureFlag', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should default every flag to enabled for director accounts', async () => {
    mockDirector(true);
    setAuthorization(true);

    const { isEnabled } = await renderStore(() => useFeatureFlag());

    expect(await waitForValue(isEnabled(FeatureFlag.EditMode), true)).toBe(
      true,
    );
    expect(await waitForValue(isEnabled(FeatureFlag.SmartRelated), true))
      .toBe(true);
  });

  it('should default every flag to disabled for non-director accounts', async () => {
    mockDirector(false);
    setAuthorization(true);

    const { isEnabled } = await renderStore(() => useFeatureFlag());

    expect(await waitForValue(isEnabled(FeatureFlag.EditMode), false)).toBe(
      false,
    );
  });

  it('should default every flag to disabled for anonymous visitors', async () => {
    setAuthorization(false);

    const { isEnabled } = await renderStore(() => useFeatureFlag());

    expect(await waitForValue(isEnabled(FeatureFlag.EditMode), false)).toBe(
      false,
    );
  });

  it('should let a manual override win over the director default', async () => {
    mockDirector(true);
    setAuthorization(true);

    const { isEnabled, setFlag } = await renderStore(() => useFeatureFlag());
    setFlag(FeatureFlag.EditMode, false);

    expect(await waitForValue(isEnabled(FeatureFlag.EditMode), false)).toBe(
      false,
    );
  });

  it('should let a manual override enable a flag for non-director accounts', async () => {
    mockDirector(false);
    setAuthorization(true);

    const { isEnabled, setFlag } = await renderStore(() => useFeatureFlag());
    setFlag(FeatureFlag.EditMode, true);

    expect(await waitForValue(isEnabled(FeatureFlag.EditMode), true)).toBe(
      true,
    );
  });
});
