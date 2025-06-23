import { AuthEndpoint } from '$lib/features/auth/AuthEndpoint.ts';
import { AuthMappedMock } from '$mocks/data/auth/AuthMappedMock.ts';
import { AuthMock } from '$mocks/data/auth/AuthMock.ts';
import { ExpiredAuthMock } from '$mocks/data/auth/ExpiredAuthMock.ts';
import { mockRequestEvent } from '$test/request/mockRequestEvent.ts';
import { describe, expect, it, vi } from 'vitest';
import { AUTH_COOKIE_NAME, handle } from './handle.ts';

describe('handle: auth', () => {
  const request = new Request('http://localhost', {
    headers: {
      accept: 'text/html',
    },
  });

  it('should handle logout', async () => {
    const event = mockRequestEvent({
      url: `http://localhost${AuthEndpoint.Logout}`,
      request,
    });

    const response = await handle({ event, resolve: vi.fn() });

    expect(response).toBeInstanceOf(Response);
    expect(event.locals.auth).toBeNull();
    expect(response.headers.get('Set-Cookie')).toBe(
      'trakt-auth=;httpOnly=true;secure=true;maxAge=0;path=/',
    );
  });

  it('should handle invalid cookie contents', async () => {
    const event = mockRequestEvent({
      url: 'http://localhost',
      request,
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
      request,
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

  it('should handle expiring cookies', async () => {
    const event = mockRequestEvent({
      url: 'http://localhost',
      request,
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
