import { AuthMappedMock } from '$mocks/data/auth/AuthMappedMock';
import { EncryptedAuthMock } from '$mocks/data/auth/EncryptedAuthMock';
import { mockRequestEvent } from '$test/request/mockRequestEvent';
import { describe, expect, it, vi } from 'vitest';
import { AuthEndpoint } from './AuthEndpoint';
import { key } from './environment';
import { AUTH_COOKIE_NAME, handle } from './handle';
import { decrypt } from './utils/decrypt';

describe('handle', () => {
  it('should handle logout', async () => {
    const event = mockRequestEvent({
      url: `http://localhost${AuthEndpoint.Logout}`,
    });

    const response = await handle({ event, resolve: vi.fn() });

    expect(response).toBeInstanceOf(Response);
    expect(event.locals.auth).toBeNull();
    expect(response.headers.get('Set-Cookie')).toBe('trakt-auth=');
  });

  it('should handle auth code exchange', async () => {
    const event = mockRequestEvent({
      url: 'http://localhost?code=test-code',
    });

    const response = await handle({ event, resolve: vi.fn() });

    expect(response).toBeInstanceOf(Response);
    expect(response.headers.get('Location')).toBe('http://localhost/');
    expect(response.status).toBe(302);
    expect(event.locals.auth).toEqual({
      ...AuthMappedMock,
      expiresAt: expect.any(Number),
    });
  });

  it('should handle decryption failure', async () => {
    const event = mockRequestEvent({
      url: 'http://localhost',
      cookieHandler: (key: string) => {
        if (key === AUTH_COOKIE_NAME) {
          return 'invalid';
        }

        return null;
      },
    });

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    await handle({ event, resolve: vi.fn() });

    expect(event.locals.auth).toEqual(null);
    expect(event.cookies.getAll().find((c) => c.name)?.value)
      .toEqual('');
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('should handle legacy auth cookie', async () => {
    const decryptedAuth = await decrypt(
      key,
      EncryptedAuthMock,
    );

    const event = mockRequestEvent({
      url: 'http://localhost',
      cookieHandler: (key: string) => {
        if (key === AUTH_COOKIE_NAME) {
          return JSON.stringify(decryptedAuth);
        }

        return null;
      },
    });

    await handle({ event, resolve: vi.fn() });

    expect(event.locals.auth).toEqual(decryptedAuth);
    expect(event.cookies.set).toHaveBeenCalled();
    expect(event.cookies.getAll().find((c) => c.name)?.value)
      .toEqual(EncryptedAuthMock);
  });

  it('should handle encrypted auth cookie', async () => {
    const event = mockRequestEvent({
      url: 'http://localhost',
      cookieHandler: (key: string) => {
        if (key === AUTH_COOKIE_NAME) {
          return EncryptedAuthMock;
        }

        return null;
      },
    });

    await handle({ event, resolve: vi.fn() });

    expect(event.locals.auth).toEqual(AuthMappedMock);
  });
});
