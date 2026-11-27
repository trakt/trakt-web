import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { MovieLoreVipMappedMock } from '$mocks/data/summary/movie-lore/mapped/MovieLoreVipMappedMock.ts';
import { MovieLoreVipResponseMock } from '$mocks/data/summary/movie-lore/response/MovieLoreVipResponseMock.ts';
import { server } from '$mocks/server.ts';
import { createTestBedQuery } from '$test/beds/query/createTestBedQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { movieLoreQuery } from './movieLoreQuery.ts';

const URL = 'http://localhost/v3/movies/dune-part-two-2024/lore';

function query(isVip = true) {
  return createTestBedQuery(
    movieLoreQuery({ slug: 'dune-part-two-2024', isVip }),
  );
}

describe('movieLoreQuery', () => {
  it('should query the lore of a movie', async () => {
    server.use(
      http.get(URL, () => HttpResponse.json(MovieLoreVipResponseMock)),
    );

    const result = await runQuery({
      factory: () => query(),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal(MovieLoreVipMappedMock);
  });

  it('should resolve to nothing for a movie without lore', async () => {
    server.use(
      http.get(URL, () =>
        HttpResponse.json({ error: 'movie_lore_not_found' }, { status: 404 }),
      ),
    );

    const result = await runQuery({
      factory: () => query(),
      mapper: (response) => response?.data,
      waitFor: (data) => data === null,
    });

    expect(result).toBeNull();
  });

  it('should cache the VIP and the standard shapes apart', () => {
    const vip = movieLoreQuery({
      slug: 'dune-part-two-2024',
      isVip: true,
    });
    const standard = movieLoreQuery({
      slug: 'dune-part-two-2024',
      isVip: false,
    });

    expect(vip.queryKey).not.to.deep.equal(standard.queryKey);
  });

  it('should refetch when the VIP status changes', () => {
    const { queryKey } = movieLoreQuery({
      slug: 'dune-part-two-2024',
      isVip: true,
    });

    expect(queryKey).to.include(InvalidateAction.Vip.Updated);
  });
});
