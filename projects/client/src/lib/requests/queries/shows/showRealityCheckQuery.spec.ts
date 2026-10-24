import { RealityCheckVipMappedMock } from '$mocks/data/summary/reality-check/mapped/RealityCheckVipMappedMock.ts';
import { RealityCheckVipResponseMock } from '$mocks/data/summary/reality-check/response/RealityCheckVipResponseMock.ts';
import { ShowSiloMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloMappedMock.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { server } from '$mocks/server.ts';
import { createTestBedQuery } from '$test/beds/query/createTestBedQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { showRealityCheckQuery } from './showRealityCheckQuery.ts';

describe('showRealityCheckQuery', () => {
  it('should query for show Reality Check', async () => {
    server.use(
      http.get(
        `http://localhost/v3/media/show/${ShowSiloMappedMock.slug}/info/34/version/1`,
        () => HttpResponse.json(RealityCheckVipResponseMock),
      ),
    );

    const result = await runQuery({
      factory: () =>
        createTestBedQuery(
          showRealityCheckQuery({
            slug: ShowSiloMappedMock.slug,
            locale: 'en',
            enabled: true,
          }),
        ),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal(RealityCheckVipMappedMock);
  });

  it('should refetch when the VIP status changes', () => {
    const { queryKey } = showRealityCheckQuery({
      slug: ShowSiloMappedMock.slug,
      locale: 'en',
      enabled: true,
    });

    expect(queryKey).to.include(InvalidateAction.Vip.Updated);
  });
});
