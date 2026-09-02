import { createSilentRenewGuard } from '$lib/features/auth/createSilentRenewGuard.ts';
import {
  getSilentRenewGuard,
  setSilentRenewGuard,
} from '$lib/features/auth/stores/silentRenewGuard.ts';
import { setToken } from '$lib/features/auth/token/index.ts';
import { setUserManager } from '$lib/features/auth/stores/userManager.ts';
import { time } from '$lib/utils/timing/time.ts';
import { ErrorResponse, type User, type UserManager } from 'oidc-client-ts';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createAuthenticatedFetch } from './createAuthenticatedFetch.ts';

const LAPSED_TOKEN = 'lapsed-token';
const RENEWED_TOKEN = 'renewed-token';

function makeRenewedUser(): User {
  return {
    access_token: RENEWED_TOKEN,
    expires_at: (Date.now() + time.hours(1)) / 1000,
    expired: false,
  } as User;
}

function stubUserManager(
  signinSilent: () => Promise<User | null>,
) {
  const removeUser = vi.fn().mockResolvedValue(undefined);

  setUserManager(
    {
      // Lapsed, so `renewAccessToken` never short-circuits into adopting it.
      getUser: vi.fn().mockResolvedValue(null),
      signinSilent: vi.fn(signinSilent),
      removeUser,
      settings: { accessTokenExpiringNotificationTimeInSeconds: 60 },
    } as unknown as UserManager,
  );

  return { removeUser };
}

const BACKGROUND_COOLDOWN = time.seconds(30);
const clock = { value: 0 };

function stubRenewGuard(
  { maxConsecutiveFailures = 3 }: { maxConsecutiveFailures?: number } = {},
) {
  clock.value = 0;

  setSilentRenewGuard(
    createSilentRenewGuard<User | null>({
      now: () => clock.value,
      cooldownMs: BACKGROUND_COOLDOWN,
      maxConsecutiveFailures,
      failureResetMs: time.minutes(5),
    }),
  );
}

function bearerOf(call: Parameters<typeof fetch> | undefined) {
  return new Headers(call?.[1]?.headers).get('Authorization');
}

describe('createAuthenticatedFetch', () => {
  beforeEach(() => {
    setToken({ value: LAPSED_TOKEN, expiresAt: Date.now() });
    stubRenewGuard();
  });

  afterEach(() => {
    setUserManager(null);
    setSilentRenewGuard(null);
    setToken(null);
  });

  it('should attach the current bearer', async () => {
    const baseFetch = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(null),
    );

    await createAuthenticatedFetch(baseFetch as unknown as typeof fetch)('/x');

    expect(bearerOf(baseFetch.mock.calls.at(0))).toBe(`Bearer ${LAPSED_TOKEN}`);
  });

  it('should retry a 401 with the renewed bearer', async () => {
    stubUserManager(() => Promise.resolve(makeRenewedUser()));
    const baseFetch = vi.fn<typeof fetch>()
      .mockResolvedValueOnce(new Response(null, { status: 401 }))
      .mockResolvedValueOnce(new Response(null, { status: 200 }));

    const response = await createAuthenticatedFetch(
      baseFetch as unknown as typeof fetch,
    )('/x');

    expect(response.status).toBe(200);
    expect(bearerOf(baseFetch.mock.calls.at(1))).toBe(
      `Bearer ${RENEWED_TOKEN}`,
    );
  });

  it('should keep the session when a renewal fails transiently', async () => {
    const { removeUser } = stubUserManager(() =>
      Promise.reject(new TypeError('Failed to fetch'))
    );
    const baseFetch = vi.fn().mockResolvedValue(
      new Response(null, { status: 401 }),
    );

    const response = await createAuthenticatedFetch(
      baseFetch as unknown as typeof fetch,
    )('/x');

    expect(response.status).toBe(401);
    expect(removeUser).not.toHaveBeenCalled();
    expect(baseFetch).toHaveBeenCalledTimes(1);
  });

  it('should clear the session when the grant is refused', async () => {
    const { removeUser } = stubUserManager(() =>
      Promise.reject(new ErrorResponse({ error: 'invalid_grant' }))
    );
    const baseFetch = vi.fn().mockResolvedValue(
      new Response(null, { status: 401 }),
    );

    await createAuthenticatedFetch(baseFetch as unknown as typeof fetch)('/x');

    expect(removeUser).toHaveBeenCalledTimes(1);
  });

  it('should not renew for a request that carried no bearer', async () => {
    setToken(null);
    const { removeUser } = stubUserManager(() =>
      Promise.reject(new ErrorResponse({ error: 'invalid_grant' }))
    );
    const baseFetch = vi.fn().mockResolvedValue(
      new Response(null, { status: 401 }),
    );

    await createAuthenticatedFetch(baseFetch as unknown as typeof fetch)('/x');

    expect(removeUser).not.toHaveBeenCalled();
    expect(baseFetch).toHaveBeenCalledTimes(1);
  });

  it('should share one renewal across a burst of 401s', async () => {
    let renewals = 0;
    stubUserManager(() => {
      renewals = renewals + 1;
      return Promise.resolve(makeRenewedUser());
    });
    const baseFetch = vi.fn().mockImplementation((_input, init) =>
      Promise.resolve(
        new Response(null, {
          status: new Headers(init?.headers).get('Authorization') ===
              `Bearer ${RENEWED_TOKEN}`
            ? 200
            : 401,
        }),
      )
    );

    const authenticatedFetch = createAuthenticatedFetch(
      baseFetch as unknown as typeof fetch,
    );
    const responses = await Promise.all(
      Array.from({ length: 5 }, () => authenticatedFetch('/x')),
    );

    expect(renewals).toBe(1);
    expect(responses.every((response) => response.status === 200)).toBe(true);
  });
  it('should stop renewing once the breaker has opened', async () => {
    stubRenewGuard({ maxConsecutiveFailures: 1 });
    let renewals = 0;
    stubUserManager(() => {
      renewals = renewals + 1;
      return Promise.reject(new TypeError('Failed to fetch'));
    });
    const baseFetch = vi.fn().mockResolvedValue(
      new Response(null, { status: 401 }),
    );
    const authenticatedFetch = createAuthenticatedFetch(
      baseFetch as unknown as typeof fetch,
    );

    await authenticatedFetch('/x');
    clock.value = BACKGROUND_COOLDOWN;
    await authenticatedFetch('/x');

    expect(renewals).toBe(1);
  });

  it('should renew a 401 the background cooldown would have silenced', async () => {
    stubUserManager(() => Promise.resolve(makeRenewedUser()));
    await getSilentRenewGuard()?.renew(() => Promise.resolve(null));

    clock.value = time.seconds(6);
    const baseFetch = vi.fn<typeof fetch>()
      .mockResolvedValueOnce(new Response(null, { status: 401 }))
      .mockResolvedValueOnce(new Response(null, { status: 200 }));

    const response = await createAuthenticatedFetch(
      baseFetch as unknown as typeof fetch,
    )('/x');

    expect(response.status).toBe(200);
    expect(bearerOf(baseFetch.mock.calls.at(1))).toBe(
      `Bearer ${RENEWED_TOKEN}`,
    );
  });

  it('should not renew again for a 401 that trails a fresh token', async () => {
    let renewals = 0;
    stubUserManager(() => {
      renewals = renewals + 1;
      return Promise.resolve(makeRenewedUser());
    });
    const baseFetch = vi.fn().mockResolvedValue(
      new Response(null, { status: 401 }),
    );
    const authenticatedFetch = createAuthenticatedFetch(
      baseFetch as unknown as typeof fetch,
    );

    await authenticatedFetch('/x');
    clock.value = time.seconds(1);
    await authenticatedFetch('/x');

    expect(renewals).toBe(1);
  });

  it('should return the 401 untouched when no guard is mounted', async () => {
    setSilentRenewGuard(null);
    const { removeUser } = stubUserManager(() =>
      Promise.resolve(makeRenewedUser())
    );
    const baseFetch = vi.fn().mockResolvedValue(
      new Response(null, { status: 401 }),
    );

    const response = await createAuthenticatedFetch(
      baseFetch as unknown as typeof fetch,
    )('/x');

    expect(response.status).toBe(401);
    expect(removeUser).not.toHaveBeenCalled();
    expect(baseFetch).toHaveBeenCalledTimes(1);
  });
});
