import { server } from '$mocks/server.ts';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { removeAvatarRequest } from './removeAvatarRequest.ts';

describe('removeAvatarRequest', () => {
  it('should report success on a 204', async () => {
    server.use(
      http.delete(
        'http://localhost/users/avatar',
        () => new HttpResponse(null, { status: 204 }),
      ),
    );

    await expect(removeAvatarRequest()).resolves.toBe(true);
  });

  it('should report failure on a 401', async () => {
    server.use(
      http.delete(
        'http://localhost/users/avatar',
        () => new HttpResponse(null, { status: 401 }),
      ),
    );

    await expect(removeAvatarRequest()).resolves.toBe(false);
  });

  it('should report failure when the removal never reaches the server', async () => {
    server.use(
      http.delete('http://localhost/users/avatar', () => HttpResponse.error()),
    );

    await expect(removeAvatarRequest()).resolves.toBe(false);
  });
});
