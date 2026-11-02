import { describe, expect, it, vi } from 'vitest';
import { fetchWithoutAuthorization } from './fetchWithoutAuthorization.ts';

const call = async (input: string) => {
  const fetch = vi.fn((_input: string, _init?: RequestInit) =>
    Promise.resolve(new Response()),
  );

  await fetchWithoutAuthorization(fetch as unknown as typeof globalThis.fetch)(
    input,
    {
      headers: {
        Authorization: 'Bearer someone-else',
        'trakt-api-version': '2',
      },
    },
  );

  return fetch.mock.calls.at(0);
};

describe('util: fetchWithoutAuthorization', () => {
  it('should drop the authorization header and keep the rest', async () => {
    const [, init] = (await call('https://api.trakt.tv/x')) ?? [];
    const headers = new Headers(init?.headers);

    expect(headers.has('Authorization')).toBe(false);
    expect(headers.get('trakt-api-version')).toBe('2');
  });

  it('should pass relative proxy paths through untouched', async () => {
    expect((await call('/api/trakt/users/sean'))?.at(0)).toBe(
      '/api/trakt/users/sean',
    );
  });
});
