import { time } from '$lib/utils/timing/time.ts';
import { OidcUserMock } from '$mocks/data/auth/OidcUserMock.ts';
import { renderStore, setAuthorization } from '$test/beds/store/renderStore.ts';
import { get } from 'svelte/store';
import { describe, expect, it } from 'vitest';
import { getToken } from '../token/index.ts';
import { initializeUserManager } from './initializeUserManager.ts';
import { useAuth } from './useAuth.ts';

describe('initializeUserManager', () => {
  it('should initialize unauthorized users', async () => {
    await renderStore(() => initializeUserManager());
    const { isAuthorized } = await renderStore(() => useAuth());

    const token = getToken();
    expect(token.expiresAt).toBeNull();
    expect(token.value).toBeNull();
    expect(get(isAuthorized)).toBe(false);
  });

  it('should initialize authorized users', async () => {
    setAuthorization(true);
    await renderStore(() => initializeUserManager(OidcUserMock.access_token));
    const { isAuthorized } = await renderStore(() => useAuth());

    const token = getToken();
    expect(token.expiresAt).toEqual(time.seconds(OidcUserMock.expires_at));
    expect(token.value).toEqual(OidcUserMock.access_token);
    expect(get(isAuthorized)).toBe(true);
  });
});
