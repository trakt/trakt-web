import { server } from '$mocks/server.ts';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { realityCheckRequest } from './realityCheckRequest.ts';

const URL = 'http://localhost/v3/media/movie/heretic-2024/info/34/version/1';

function request() {
  return realityCheckRequest({
    type: 'movie',
    slug: 'heretic-2024',
    locale: 'en',
  });
}

describe('realityCheckRequest', () => {
  it('should treat a missing Reality Check as no content', async () => {
    server.use(http.get(URL, () => new HttpResponse(null, { status: 404 })));

    expect(await request()).to.deep.equal({ body: undefined, status: 204 });
  });

  it('should treat an empty response as no content', async () => {
    server.use(http.get(URL, () => new HttpResponse(null, { status: 204 })));

    expect(await request()).to.deep.equal({ body: undefined, status: 204 });
  });

  it('should pass a server failure through so the query retries', async () => {
    server.use(http.get(URL, () => new HttpResponse(null, { status: 503 })));

    expect(await request()).to.deep.equal({ body: undefined, status: 503 });
  });
});
