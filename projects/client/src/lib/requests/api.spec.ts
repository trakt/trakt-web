import { setToken } from '$lib/features/auth/token/index.ts';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { rawApiFetch } from './api.ts';

describe('rawApiFetch', () => {
  afterEach(() => setToken(null));

  function spyFetch() {
    return vi.fn(
      (_input: RequestInfo | URL, _init?: RequestInit) =>
        Promise.resolve(new Response(null, { status: 200 })),
    );
  }

  function requestHeaders(spy: ReturnType<typeof spyFetch>): Headers {
    return new Headers(spy.mock.calls[0]?.[1]?.headers);
  }

  it('should attach the Bearer token by default', async () => {
    setToken({ value: 'user-token', expiresAt: Date.now() + 10_000 });
    const fetch = spyFetch();

    await rawApiFetch({
      fetch: fetch as unknown as typeof globalThis.fetch,
      path: '/x',
    });

    expect(requestHeaders(fetch).get('Authorization')).to.equal(
      'Bearer user-token',
    );
  });

  it('should send no Bearer token when authenticated is false', async () => {
    // The slurm request must never carry the signed-in user's token, so a
    // different account can never mix into an out-of-band authorized request.
    setToken({ value: 'user-token', expiresAt: Date.now() + 10_000 });
    const fetch = spyFetch();

    await rawApiFetch({
      fetch: fetch as unknown as typeof globalThis.fetch,
      path: '/x',
      authenticated: false,
    });

    expect(requestHeaders(fetch).has('Authorization')).to.equal(false);
  });
});
