import { MatchMappedMock } from '$mocks/data/summary/match/mapped/MatchMappedMock.ts';
import { MatchResponseMock } from '$mocks/data/summary/match/response/MatchResponseMock.ts';
import { server } from '$mocks/server.ts';
import { createTestBedQuery } from '$test/beds/query/createTestBedQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { InvalidateAction } from '../../models/InvalidateAction.ts';
import { matchQuery } from './matchQuery.ts';

function queryMatch(type: 'movie' | 'show') {
  return runQuery({
    factory: () =>
      createTestBedQuery(matchQuery({ type, id: 1, enabled: true })),
    mapper: (response) => ({
      score: response?.data?.score,
      taste: response?.data?.taste,
      kind: response?.data?.kind,
      basis: response?.data?.basis,
      reasons: response?.data?.reasons,
      isSuccess: response?.isSuccess,
    }),
    waitFor: ({ isSuccess }) => isSuccess === true,
  });
}

describe('matchQuery', () => {
  it('should query the score of a movie', async () => {
    server.use(
      http.get('http://localhost/movies/:id/match', () =>
        HttpResponse.json(MatchResponseMock),
      ),
    );

    expect(await queryMatch('movie')).toMatchObject({
      score: MatchMappedMock.score,
      taste: MatchMappedMock.taste,
    });
  });

  it('should query the score of a show', async () => {
    server.use(
      http.get('http://localhost/shows/:id/match', () =>
        HttpResponse.json({ match: 0 }),
      ),
    );

    expect(await queryMatch('show')).toMatchObject({ score: 0 });
  });

  it('should default a missing taste to an empty list', async () => {
    server.use(
      http.get('http://localhost/movies/:id/match', () =>
        HttpResponse.json({ match: 80 }),
      ),
    );

    expect(await queryMatch('movie')).toMatchObject({ score: 80, taste: [] });
  });

  it('should map the basis of a hype score', async () => {
    server.use(
      http.get('http://localhost/movies/:id/match', () =>
        HttpResponse.json({ kind: 'hype', match: 82, basis: 'taste' }),
      ),
    );

    expect(await queryMatch('movie')).toMatchObject({
      kind: 'hype',
      score: 82,
      basis: 'taste',
    });
  });

  it('should map the reasons of a hype score', async () => {
    const reasons = {
      series: {
        films: [
          { ids: { trakt: 7, slug: 'film-7' }, title: 'Film 7', stars: 8 },
        ],
        usual: 'about',
      },
      lists: { top: 3 },
    };
    server.use(
      http.get('http://localhost/movies/:id/match', () =>
        HttpResponse.json({ kind: 'hype', match: 73, basis: 'taste', reasons }),
      ),
    );

    expect(await queryMatch('movie')).toMatchObject({ reasons });
  });

  it('should default missing reasons to null', async () => {
    server.use(
      http.get('http://localhost/movies/:id/match', () =>
        HttpResponse.json({ kind: 'hype', match: 82 }),
      ),
    );

    expect(await queryMatch('movie')).toMatchObject({ reasons: null });
  });

  it('should default a missing basis to the series', async () => {
    server.use(
      http.get('http://localhost/movies/:id/match', () =>
        HttpResponse.json({ kind: 'hype', match: 82 }),
      ),
    );

    expect(await queryMatch('movie')).toMatchObject({ basis: 'series' });
  });

  it('should map a null score to null', async () => {
    server.use(
      http.get('http://localhost/movies/:id/match', () =>
        HttpResponse.json({ match: null }),
      ),
    );

    expect(await queryMatch('movie')).toMatchObject({ score: null });
  });

  it.each([401, 403, 404, 500])(
    'should map a %i to no score',
    async (status) => {
      server.use(
        http.get(
          'http://localhost/movies/:id/match',
          () => new HttpResponse(null, { status }),
        ),
      );

      expect(await queryMatch('movie')).toMatchObject({
        score: null,
        taste: [],
      });
    },
  );

  it('should refetch when the VIP status changes', () => {
    const { queryKey } = matchQuery({ type: 'movie', id: 1, enabled: true });

    expect(queryKey).to.include(InvalidateAction.Vip.Updated);
  });
});
