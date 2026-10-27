import { SeasonRecapPublicResponseMock } from '$mocks/data/summary/season-recap/response/SeasonRecapPublicResponseMock.ts';
import { server } from '$mocks/server.ts';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { seasonRecapRequest } from './seasonRecapRequest.ts';

const URL = 'http://localhost/v3/shows/severance/seasons/1/recap';

function request() {
  return seasonRecapRequest({ slug: 'severance', season: 1 });
}

describe('seasonRecapRequest', () => {
  it('should parse the recap', async () => {
    server.use(
      http.get(URL, () => HttpResponse.json(SeasonRecapPublicResponseMock)),
    );

    expect(await request()).to.deep.equal({
      body: SeasonRecapPublicResponseMock,
      status: 200,
    });
  });

  it('should treat a season without a recap as no content', async () => {
    server.use(
      http.get(URL, () =>
        HttpResponse.json({ error: 'recap_not_found' }, { status: 404 }),
      ),
    );

    expect(await request()).to.deep.equal({ body: undefined, status: 204 });
  });

  it('should pass a server failure through so the query retries', async () => {
    server.use(http.get(URL, () => new HttpResponse(null, { status: 503 })));

    expect(await request()).to.deep.equal({ body: undefined, status: 503 });
  });

  it('should reject a response that is not a recap', async () => {
    server.use(http.get(URL, () => HttpResponse.json({ season: 'one' })));

    await expect(request()).rejects.toThrow();
  });
});
