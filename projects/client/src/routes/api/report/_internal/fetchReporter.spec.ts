import { server } from '$mocks/server.ts';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { fetchReporter } from './fetchReporter.ts';

const settingsWith = (user: Record<string, unknown>) =>
  server.use(
    http.get('http://localhost/users/settings', () =>
      HttpResponse.json({
        user: { username: 'tester', ids: { trakt: 7 }, ...user },
      }),
    ),
  );

describe('util: fetchReporter', () => {
  it('should take the reporter from the caller settings', async () => {
    settingsWith({ vip: true });

    expect(await fetchReporter({ token: 'token', fetch })).toEqual({
      userId: '7',
      username: 'tester',
      isVip: true,
    });
  });

  it('should fall back to the uuid when the trakt id is missing', async () => {
    settingsWith({ ids: { uuid: 'abc-123' }, vip: false });

    expect(await fetchReporter({ token: 'token', fetch })).toMatchObject({
      userId: 'abc-123',
    });
  });

  it('should count a VIP EP account as VIP', async () => {
    settingsWith({ vip: false, vip_ep: true });

    expect(await fetchReporter({ token: 'token', fetch })).toMatchObject({
      isVip: true,
    });
  });

  it('should count a free account as not VIP', async () => {
    settingsWith({ vip: false, vip_ep: false });

    expect(await fetchReporter({ token: 'token', fetch })).toMatchObject({
      isVip: false,
    });
  });

  it('should send the caller token', async () => {
    const seen: Array<string | null> = [];
    server.use(
      http.get('http://localhost/users/settings', ({ request }) => {
        seen.push(request.headers.get('authorization'));
        return HttpResponse.json({
          user: { username: 'tester', ids: { trakt: 7 } },
        });
      }),
    );

    await fetchReporter({ token: 'caller-token', fetch });

    expect(seen).toEqual(['Bearer caller-token']);
  });

  it('should be null when the settings call fails', async () => {
    server.use(
      http.get(
        'http://localhost/users/settings',
        () => new HttpResponse(null, { status: 401 }),
      ),
    );

    expect(await fetchReporter({ token: 'token', fetch })).toBeNull();
  });

  it('should be null for an unexpected body', async () => {
    server.use(
      http.get('http://localhost/users/settings', () =>
        HttpResponse.json({ nope: true }),
      ),
    );

    expect(await fetchReporter({ token: 'token', fetch })).toBeNull();
  });
});
