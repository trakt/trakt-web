import { time } from '$lib/utils/timing/time.ts';
import { OidcUserMock } from '$mocks/data/auth/OidcUserMock.ts';
import UserManagerTestBed from '$test/beds/auth/UserManagerTestBed.svelte';
import { renderStore, setAuthorization } from '$test/beds/store/renderStore.ts';
import { render } from '@testing-library/svelte';
import { BehaviorSubject } from 'rxjs';
import { WorkerMessage } from '$worker/WorkerMessage.ts';
import { ErrorResponse, type User, UserManager } from 'oidc-client-ts';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getToken, type Token } from '../token/index.ts';
import type { AuthContextType } from './createAuthContext.ts';
import { getAuthContext } from './getAuthContext.ts';
import { initializeUserManager } from './initializeUserManager.ts';
import { useAuth } from './useAuth.ts';

// Drive the real `workerRequest` against a stubbed service worker so the
// navigation-cache bust is observable end to end.
const postMessage = vi.fn();

function stubServiceWorker() {
  Object.defineProperty(globalThis.navigator, 'serviceWorker', {
    configurable: true,
    value: {
      controller: {},
      ready: Promise.resolve({ active: { postMessage } }),
    },
  });
}

const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

function makeLapsedUser(): User {
  return {
    access_token: 'lapsed-token',
    refresh_token: 'refresh-token',
    expires_at: (Date.now() - time.hours(1)) / 1000,
    expired: true,
  } as User;
}

function makeFreshUser(): User {
  return {
    access_token: 'fresh-token',
    refresh_token: 'refresh-token',
    expires_at: (Date.now() + time.hours(1)) / 1000,
    expired: false,
  } as User;
}

function stubUserManager(
  signinSilent: () => Promise<User | null>,
  user: User | null = makeLapsedUser(),
) {
  const handlers = new Map<string, () => void>();

  const stub = {
    getUser: vi.fn(() => Promise.resolve(user)),
    signinSilent: vi.fn(signinSilent),
    removeUser: vi.fn().mockResolvedValue(undefined),
    settings: { accessTokenExpiringNotificationTimeInSeconds: 60 },
    events: {
      addAccessTokenExpiring: vi.fn(() => () => {}),
      addAccessTokenExpired: vi.fn((cb: () => void) => {
        handlers.set('expired', cb);
        return () => handlers.delete('expired');
      }),
      addUserLoaded: vi.fn(() => () => {}),
      addUserUnloaded: vi.fn(() => () => {}),
      load: vi.fn().mockResolvedValue(undefined),
    },
  };

  vi.mocked(UserManager).mockImplementation(function () {
    return stub as unknown as UserManager;
  });

  return {
    stub,
    raiseAccessTokenExpired: () => handlers.get('expired')?.(),
  };
}

function renderUserManager() {
  const ctx: AuthContextType = {
    isAuthorized: new BehaviorSubject(false),
    token: new BehaviorSubject<Token | null>(null),
  };

  return new Promise<ReturnType<typeof initializeUserManager>>((resolve) =>
    render(UserManagerTestBed, {
      props: { params: { ctx, isResolved: false }, output: resolve },
    })
  );
}

async function renderGate() {
  const { isInitializing } = await renderUserManager();

  const emissions: boolean[] = [];
  isInitializing.subscribe((value) => emissions.push(value));
  await flush();

  return () => emissions.at(-1);
}

const bustedNavigationCache = () =>
  postMessage.mock.calls.some(([message]) =>
    message?.type === WorkerMessage.CacheBust
  );

describe('initializeUserManager', () => {
  beforeEach(() => {
    stubServiceWorker();
    postMessage.mockClear();
  });

  afterEach(() => {
    setAuthorization(false);
  });

  it('should initialize unauthorized users', async () => {
    await renderStore(() => {
      const ctx = getAuthContext();
      return initializeUserManager({ ctx });
    });
    const { isAuthorized } = await renderStore(() => useAuth());
    await flush();

    const token = getToken();
    expect(token.expiresAt).toBeNull();
    expect(token.value).toBeNull();
    expect(isAuthorized.value).toBe(false);
    expect(bustedNavigationCache()).toBe(false);
  });

  it('should initialize authorized users', async () => {
    setAuthorization(true);
    await renderStore(() => {
      const ctx = getAuthContext();
      return initializeUserManager({
        ctx,
        tokenFromServer: OidcUserMock.access_token,
      });
    });
    const { isAuthorized } = await renderStore(() => useAuth());
    await flush();

    const token = getToken();
    expect(token.expiresAt).toEqual(time.seconds(OidcUserMock.expires_at));
    expect(token.value).toEqual(OidcUserMock.access_token);
    expect(isAuthorized.value).toBe(true);
    expect(bustedNavigationCache()).toBe(false);
  });

  it('should bust the navigation cache when an unauthorized context resolves to authorized', async () => {
    setAuthorization(true);
    await renderStore(() => {
      const ctx = getAuthContext();
      // A stale, SSR-unauthorized navigation document is hydrated while the
      // client actually holds a valid session - the flicker scenario.
      ctx.isAuthorized.next(false);
      return initializeUserManager({
        ctx,
        tokenFromServer: OidcUserMock.access_token,
      });
    });
    await renderStore(() => useAuth());
    await flush();

    expect(bustedNavigationCache()).toBe(true);
  });
  describe('renewal', () => {
    afterEach(() => {
      vi.mocked(UserManager).mockReset();
    });

    it('should hold the gate while a renewal another holder started is in flight', async () => {
      let settle: (value: User | null) => void = () => {};
      const { raiseAccessTokenExpired } = stubUserManager(() =>
        new Promise<User | null>((resolve) => {
          settle = resolve;
        })
      );

      const isInitializing = await renderGate();

      expect(isInitializing()).toBe(true);

      raiseAccessTokenExpired();
      await flush();

      expect(isInitializing()).toBe(true);

      settle(makeFreshUser());
      await flush();

      expect(isInitializing()).toBe(false);
    });

    it('should clear a refused grant out of storage', async () => {
      const { stub } = stubUserManager(() =>
        Promise.reject(new ErrorResponse({ error: 'invalid_grant' }))
      );

      const isInitializing = await renderGate();

      expect(stub.removeUser).toHaveBeenCalledTimes(1);
      expect(isInitializing()).toBe(false);
    });
  });
});
