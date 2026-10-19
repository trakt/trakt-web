import { server } from '$mocks/server.ts';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { jellyfinAuthRequest } from './jellyfinAuthRequest.ts';

const AUTH_URL = 'http://localhost/v3/users/me/sync/jellyfin/auth';

const PENDING = {
  status: 'pending',
  attempt_id: '0b7f0d3e-8f5c-4a4e-9c55-2f1f8d1e6a10',
  code: '482913',
  expires_in: 600,
  server_name: 'Basement',
  account_name: null,
  libraries: null,
};

describe('jellyfinAuthRequest', () => {
  it('should send a Quick Connect sign-in and map the pending code', async () => {
    const bodies: unknown[] = [];
    server.use(
      http.post(AUTH_URL, async ({ request }) => {
        bodies.push(await request.json());
        return HttpResponse.json(PENDING, { status: 202 });
      }),
    );

    const result = await jellyfinAuthRequest({
      signIn: {
        method: 'quick-connect',
        serverUrl: 'https://jellyfin.example.com',
      },
    });

    expect(bodies).toEqual([
      { server_url: 'https://jellyfin.example.com', quick_connect: true },
    ]);
    expect(result).toEqual({
      ok: true,
      value: {
        status: 'pending',
        attemptId: PENDING.attempt_id,
        code: '482913',
        expiresIn: 600,
        serverName: 'Basement',
      },
    });
  });

  it('should map an authenticated sign-in with its libraries', async () => {
    server.use(
      http.post(AUTH_URL, () =>
        HttpResponse.json(
          {
            ...PENDING,
            status: 'authenticated',
            code: null,
            account_name: 'harry',
            libraries: [
              {
                external_id: 'a1',
                kind: 'movies',
                title: 'Films',
                item_count: 812,
              },
            ],
          },
          { status: 201 },
        ),
      ),
    );

    const result = await jellyfinAuthRequest({
      signIn: {
        method: 'password',
        serverUrl: 'https://jellyfin.example.com',
        username: 'harry',
        password: 'secret',
      },
    });

    expect(result).toEqual({
      ok: true,
      value: {
        status: 'authenticated',
        attemptId: PENDING.attempt_id,
        serverName: 'Basement',
        libraries: [
          { externalId: 'a1', kind: 'movies', title: 'Films', itemCount: 812 },
        ],
      },
    });
  });

  it('should surface the error code of a rejected sign-in', async () => {
    server.use(
      http.post(AUTH_URL, () =>
        HttpResponse.json({ error: 'server_unreachable' }, { status: 504 }),
      ),
    );

    const result = await jellyfinAuthRequest({
      signIn: {
        method: 'quick-connect',
        serverUrl: 'https://jellyfin.example.com',
      },
    });

    expect(result).toEqual({ ok: false, error: 'server_unreachable' });
  });
});
