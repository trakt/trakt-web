import { time } from '$lib/utils/timing/time.ts';
import type { User, UserManager } from 'oidc-client-ts';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { renewAccessToken } from './renewAccessToken.ts';

const notificationTimeSeconds = 60;

function makeUser(expiresInSeconds: number): User {
  return {
    access_token: `token-${expiresInSeconds}`,
    expires_at: (Date.now() + time.seconds(expiresInSeconds)) / 1000,
    expired: expiresInSeconds <= 0,
  } as User;
}

function makeManager(current: User | null, renewed: User | null = null) {
  const signinSilent = vi.fn().mockResolvedValue(renewed);
  const load = vi.fn().mockResolvedValue(undefined);

  return {
    manager: {
      getUser: vi.fn().mockResolvedValue(current),
      signinSilent,
      events: { load },
      settings: {
        accessTokenExpiringNotificationTimeInSeconds: notificationTimeSeconds,
      },
    } as unknown as UserManager,
    signinSilent,
    load,
  };
}

function stubLocks(request: (name: string, task: () => unknown) => unknown) {
  Object.defineProperty(globalThis.navigator, 'locks', {
    configurable: true,
    value: { request },
  });
}

describe('renewAccessToken', () => {
  afterEach(() => {
    Reflect.deleteProperty(globalThis.navigator, 'locks');
  });

  it('should renew when the stored token has lapsed', async () => {
    const renewed = makeUser(3600);
    const { manager, signinSilent } = makeManager(makeUser(-1), renewed);

    const result = await renewAccessToken(manager);

    expect(signinSilent).toHaveBeenCalledTimes(1);
    expect(result).toBe(renewed);
  });

  it('should renew when there is no stored token', async () => {
    const renewed = makeUser(3600);
    const { manager, signinSilent } = makeManager(null, renewed);

    const result = await renewAccessToken(manager);

    expect(signinSilent).toHaveBeenCalledTimes(1);
    expect(result).toBe(renewed);
  });

  it('should adopt a token another holder just minted', async () => {
    const current = makeUser(3600);
    const { manager, signinSilent } = makeManager(current);

    const result = await renewAccessToken(manager);

    expect(signinSilent).not.toHaveBeenCalled();
    expect(result).toBe(current);
  });

  it('should renew a fresh token the server just rejected', async () => {
    const current = makeUser(3600);
    const renewed = makeUser(7200);
    const { manager, signinSilent } = makeManager(current, renewed);

    const result = await renewAccessToken(manager, current.access_token);

    expect(signinSilent).toHaveBeenCalledTimes(1);
    expect(result).toBe(renewed);
  });

  it('should adopt a fresh token when another holder minted it', async () => {
    const current = makeUser(3600);
    const { manager, signinSilent } = makeManager(current);

    const result = await renewAccessToken(manager, 'a-token-since-replaced');

    expect(signinSilent).not.toHaveBeenCalled();
    expect(result).toBe(current);
  });

  it('should announce an adopted token so every holder writes it', async () => {
    const current = makeUser(3600);
    const { manager, load } = makeManager(current);

    await renewAccessToken(manager);

    expect(load).toHaveBeenCalledWith(current);
  });

  it('should renew a token already inside its expiring window', async () => {
    const renewed = makeUser(3600);
    const { manager, signinSilent } = makeManager(
      makeUser(notificationTimeSeconds - 1),
      renewed,
    );

    await renewAccessToken(manager);

    expect(signinSilent).toHaveBeenCalledTimes(1);
  });

  it('should hold the renew lock for the whole attempt', async () => {
    const request = vi.fn((_name: string, task: () => unknown) => task());
    stubLocks(request);
    const { manager } = makeManager(makeUser(-1), makeUser(3600));

    await renewAccessToken(manager);

    expect(request).toHaveBeenCalledWith(
      'trakt-auth-renew',
      expect.any(
        Function,
      ),
    );
  });

  it('should renew without a lock manager', async () => {
    const { manager, signinSilent } = makeManager(makeUser(-1), makeUser(3600));

    await renewAccessToken(manager);

    expect(signinSilent).toHaveBeenCalledTimes(1);
  });
});
