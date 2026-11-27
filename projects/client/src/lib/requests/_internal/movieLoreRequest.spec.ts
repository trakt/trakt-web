import { MovieLoreVipResponseMock } from '$mocks/data/summary/movie-lore/response/MovieLoreVipResponseMock.ts';
import { server } from '$mocks/server.ts';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { movieLoreRequest } from './movieLoreRequest.ts';

const URL = 'http://localhost/v3/movies/dune-part-two-2024/lore';

function request() {
  return movieLoreRequest({ slug: 'dune-part-two-2024' });
}

describe('movieLoreRequest', () => {
  it('should parse the lore', async () => {
    server.use(
      http.get(URL, () => HttpResponse.json(MovieLoreVipResponseMock)),
    );

    expect(await request()).to.deep.equal({
      body: MovieLoreVipResponseMock,
      status: 200,
    });
  });

  it('should treat a movie without lore as no content', async () => {
    server.use(
      http.get(URL, () =>
        HttpResponse.json({ error: 'movie_lore_not_found' }, { status: 404 }),
      ),
    );

    expect(await request()).to.deep.equal({ body: undefined, status: 204 });
  });

  it('should pass a server failure through so the query retries', async () => {
    server.use(http.get(URL, () => new HttpResponse(null, { status: 503 })));

    expect(await request()).to.deep.equal({ body: undefined, status: 503 });
  });

  it('should reject a response that is not lore', async () => {
    server.use(http.get(URL, () => HttpResponse.json({ kind: 'sequel' })));

    await expect(request()).rejects.toThrow();
  });
});
