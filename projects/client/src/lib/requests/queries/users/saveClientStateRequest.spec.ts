import { server } from '$mocks/server.ts';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { saveClientStateRequest } from './saveClientStateRequest.ts';

const SAVE_URL = 'http://localhost/v3/users/me/client-state/dismissed_banners';

describe('saveClientStateRequest', () => {
  it('should send the value wrapped in a body', async () => {
    const bodies: unknown[] = [];
    server.use(
      http.put(SAVE_URL, async ({ request }) => {
        bodies.push(await request.json());
        return new HttpResponse(null, { status: 204 });
      }),
    );

    expect(
      await saveClientStateRequest({
        key: 'dismissed_banners',
        value: { welcome: 'dismissed' },
      }),
    ).to.equal(true);
    expect(bodies).to.deep.equal([{ value: { welcome: 'dismissed' } }]);
  });

  it('should report a refused key as not saved', async () => {
    server.use(
      http.put(SAVE_URL, () => new HttpResponse(null, { status: 404 })),
    );

    expect(
      await saveClientStateRequest({
        key: 'dismissed_banners',
        value: {},
      }),
    ).to.equal(false);
  });
});
