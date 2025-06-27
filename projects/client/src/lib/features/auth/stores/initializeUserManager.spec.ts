import { OidcUserMock } from '$mocks/data/auth/OidcUserMock.ts';
import { renderStore, setAuthorization } from '$test/beds/store/renderStore.ts';
import { describe, expect, it } from 'vitest';
import { getToken } from '../token/index.ts';
import { initializeUserManager } from './initializeUserManager.ts';

describe('initializeUserManager', () => {
  it('should initialize unauthorized users', async () => {
    await renderStore(() => initializeUserManager(false));

    const token = getToken();
    expect(token.expiresAt).toBeUndefined();
    expect(token.value).toBeUndefined();
  });

  it('should initialize authorized users', async () => {
    setAuthorization(true);
    await renderStore(() => initializeUserManager(false));

    const token = getToken();
    expect(token.expiresAt).toEqual(OidcUserMock.expires_at);
    expect(token.value).toEqual(OidcUserMock.access_token);
  });
});
