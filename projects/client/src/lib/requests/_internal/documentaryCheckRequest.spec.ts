import { DocumentaryCheckVipResponseMock } from '$mocks/data/summary/documentary-check/response/DocumentaryCheckVipResponseMock.ts';
import { server } from '$mocks/server.ts';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { documentaryCheckRequest } from './documentaryCheckRequest.ts';

const DOCUMENTARY_CHECK_URL =
  'http://localhost/v3/media/movie/heretic-2024/info/66/version/1';

function request() {
  return documentaryCheckRequest({
    type: 'movie',
    slug: 'heretic-2024',
    locale: 'en',
  });
}

describe('documentaryCheckRequest', () => {
  it('should read the Documentary Check from info type 66 with the locale', async () => {
    const requested: Array<string | null> = [];
    server.use(
      http.get(DOCUMENTARY_CHECK_URL, ({ request }) => {
        requested.push(new URL(request.url).searchParams.get('locale'));
        return HttpResponse.json(DocumentaryCheckVipResponseMock);
      }),
    );

    expect(await request()).to.deep.equal({
      body: DocumentaryCheckVipResponseMock,
      status: 200,
    });
    expect(requested).to.deep.equal(['en']);
  });

  it('should pass a not applicable body through for the mapper to drop', async () => {
    server.use(
      http.get(DOCUMENTARY_CHECK_URL, () =>
        HttpResponse.json({ applicable: false }),
      ),
    );

    expect(await request()).to.deep.equal({
      body: { applicable: false },
      status: 200,
    });
  });

  it('should treat a missing Documentary Check as no content', async () => {
    server.use(
      http.get(
        DOCUMENTARY_CHECK_URL,
        () => new HttpResponse(null, { status: 404 }),
      ),
    );

    expect(await request()).to.deep.equal({ body: undefined, status: 204 });
  });

  it('should treat an empty response as no content', async () => {
    server.use(
      http.get(
        DOCUMENTARY_CHECK_URL,
        () => new HttpResponse(null, { status: 204 }),
      ),
    );

    expect(await request()).to.deep.equal({ body: undefined, status: 204 });
  });

  it('should pass a server failure through so the query retries', async () => {
    server.use(
      http.get(
        DOCUMENTARY_CHECK_URL,
        () => new HttpResponse(null, { status: 503 }),
      ),
    );

    expect(await request()).to.deep.equal({ body: undefined, status: 503 });
  });

  it('should reject a body with an unknown tier', async () => {
    server.use(
      http.get(DOCUMENTARY_CHECK_URL, () =>
        HttpResponse.json({
          ...DocumentaryCheckVipResponseMock,
          tier: 'bogus',
        }),
      ),
    );

    await expect(request()).rejects.toThrow();
  });
});
