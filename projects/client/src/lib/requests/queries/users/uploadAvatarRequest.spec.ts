import { server } from '$mocks/server.ts';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { uploadAvatarRequest } from './uploadAvatarRequest.ts';

const params = { avatar: 'data:image/png;base64,' };

describe('uploadAvatarRequest', () => {
  it('should report success on a 204', async () => {
    server.use(
      http.put(
        'http://localhost/users/avatar',
        () => new HttpResponse(null, { status: 204 }),
      ),
    );

    await expect(uploadAvatarRequest(params)).resolves.toBe(true);
  });

  it('should report failure on a 400', async () => {
    server.use(
      http.put(
        'http://localhost/users/avatar',
        () => new HttpResponse(null, { status: 400 }),
      ),
    );

    await expect(uploadAvatarRequest(params)).resolves.toBe(false);
  });

  it('should report failure when the upload never reaches the server', async () => {
    server.use(
      http.put('http://localhost/users/avatar', () => HttpResponse.error()),
    );

    await expect(uploadAvatarRequest(params)).resolves.toBe(false);
  });
});
