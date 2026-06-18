import { time } from '$lib/utils/timing/time.ts';
import { OidcUserMock } from '$mocks/data/auth/OidcUserMock.ts';
import { renderStore, setAuthorization } from '$test/beds/store/renderStore.ts';
import { WorkerMessage } from '$worker/WorkerMessage.ts';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getToken } from '../token/index.ts';
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
});
