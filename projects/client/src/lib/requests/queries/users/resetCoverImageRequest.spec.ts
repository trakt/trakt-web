import { server } from '$mocks/server.ts';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { resetCoverImageRequest } from './resetCoverImageRequest.ts';

describe('resetCoverImageRequest', () => {
  it('should report success when the cover is cleared', async () => {
    const result = await resetCoverImageRequest();

    expect(result).toBe(true);
  });

  it('should clear the cover with a zero id on the setter route', async () => {
    const requests: unknown[] = [];

    server.use(
      http.put('http://localhost/users/set_cover', async ({ request }) => {
        requests.push({
          pathname: new URL(request.url).pathname,
          body: await request.json(),
        });
        return new HttpResponse(null, { status: 204 });
      }),
    );

    await resetCoverImageRequest();

    expect(requests).to.deep.equal([{
      pathname: '/users/set_cover',
      body: { cover_type: 'show', cover_id: 0 },
    }]);
  });
});
