import { time } from '$lib/utils/timing/time.ts';
import { OidcUserMock } from '$mocks/data/auth/OidcUserMock.ts';
import { renderStore, setAuthorization } from '$test/beds/store/renderStore.ts';
import { describe, expect, it } from 'vitest';
import { getToken } from '../token/index.ts';
import { getAuthContext } from './getAuthContext.ts';
import { initializeUserManager } from './initializeUserManager.ts';
import { useAuth } from './useAuth.ts';

describe('initializeUserManager', () => {
  it('should initialize unauthorized users', async () => {
    await renderStore(() => {
      const ctx = getAuthContext();
      return initializeUserManager({ ctx });
    });
    const { isAuthorized } = await renderStore(() => useAuth());

    const token = getToken();
    expect(token.expiresAt).toBeNull();
    expect(token.value).toBeNull();
    expect(isAuthorized.value).toBe(false);
  });

  it('should initialize authorized users', async () => {
    setAuthorization(true);
    await renderStore(() => {
      const ctx = getAuthContext();
      return initializeUserManager({ ctx, tokenFromServer: OidcUserMock.access_token });
    });
    const { isAuthorized } = await renderStore(() => useAuth());

    const token = getToken();
    expect(token.expiresAt).toEqual(time.seconds(OidcUserMock.expires_at));
    expect(token.value).toEqual(OidcUserMock.access_token);
    expect(isAuthorized.value).toBe(true);
  });
});
