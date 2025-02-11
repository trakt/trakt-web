import { AuthEndpoint } from '$lib/features/auth/AuthEndpoint.ts';
import { AuthMappedMock } from '$mocks/data/auth/AuthMappedMock.ts';
import { AuthMock } from '$mocks/data/auth/AuthMock.ts';
import { EncryptedAuthMock } from '$mocks/data/auth/EncryptedAuthMock.ts';
import { ExpiredAuthMock } from '$mocks/data/auth/ExpiredAuthMock.ts';
import { mockRequestEvent } from '$test/request/mockRequestEvent.ts';
import { describe, expect, it, vi } from 'vitest';
import { AUTH_COOKIE_NAME, handle } from './handle.ts';

describe('handle: auth', () => {
  it('should handle logout', async () => {
    const event = mockRequestEvent({
      url: `http://localhost${AuthEndpoint.Logout}`,
    });

    const response = await handle({ event, resolve: vi.fn() });

    expect(response).toBeInstanceOf(Response);
    expect(event.locals.auth).toBeNull();
    expect(response.headers.get('Set-Cookie')).toBe(
      'trakt-auth=;httpOnly=true;secure=true;maxAge=0;path=/',
    );
  });

  it('should handle auth code exchange', async () => {
    const event = mockRequestEvent({
      url: 'http://localhost?code=test-code',
    });

    const response = await handle({ event, resolve: vi.fn() });

    expect(response).toBeInstanceOf(Response);
    expect(response.headers.get('Location')).toMatch(
      /^http:\/\/localhost\/\?_cb=\d+$/,
    );
    expect(response.status).toBe(302);
    expect(event.locals.auth).toEqual({
      ...AuthMappedMock,
      expiresAt: expect.any(Number),
    });
  });

  it('should handle invalid cookie contents', async () => {
    const event = mockRequestEvent({
      url: 'http://localhost',
      cookieHandler: (key: string) => {
        if (key === AUTH_COOKIE_NAME) {
          return 'invalid';
        }

        return null;
      },
    });

    await handle({ event, resolve: vi.fn() });

    expect(event.locals.auth).toEqual(null);
    expect(event.cookies.getAll().find((c) => c.name)?.value)
      .toEqual('');
  });

  it('should handle auth cookie', async () => {
    const event = mockRequestEvent({
      url: 'http://localhost',
      cookieHandler: (key: string) => {
        if (key === AUTH_COOKIE_NAME) {
          return AuthMock;
        }

        return null;
      },
    });

    await handle({ event, resolve: vi.fn() });

    expect(event.locals.auth).toEqual(AuthMappedMock);
  });

  it('should handle legacy encrypted auth cookie', async () => {
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

    expect(event.cookies.set).toHaveBeenCalled();
    expect(event.cookies.getAll().find((c) => c.name)?.value)
      .toEqual(AuthMock);
    expect(event.locals.auth).toEqual(AuthMappedMock);
  });

  it('should handle expiring cookies', async () => {
    const event = mockRequestEvent({
      url: 'http://localhost',
      cookieHandler: (key: string) => {
        if (key === AUTH_COOKIE_NAME) {
          return ExpiredAuthMock;
        }

        return null;
      },
    });

    await handle({ event, resolve: vi.fn() });
    expect(event.cookies.set).toHaveBeenCalled();
    expect(event.locals.auth).toEqual({
      ...AuthMappedMock,
      expiresAt: expect.any(Number),
    });
  });
});
