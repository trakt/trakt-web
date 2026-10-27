import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { SeasonRecapVipMappedMock } from '$mocks/data/summary/season-recap/mapped/SeasonRecapVipMappedMock.ts';
import { SeasonRecapVipResponseMock } from '$mocks/data/summary/season-recap/response/SeasonRecapVipResponseMock.ts';
import { server } from '$mocks/server.ts';
import { createTestBedQuery } from '$test/beds/query/createTestBedQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { showSeasonRecapQuery } from './showSeasonRecapQuery.ts';

const URL = 'http://localhost/v3/shows/severance/seasons/1/recap';

function query(isVip = true) {
  return createTestBedQuery(
    showSeasonRecapQuery({ slug: 'severance', season: 1, isVip }),
  );
}

describe('showSeasonRecapQuery', () => {
  it('should query the recap of a season', async () => {
    server.use(
      http.get(URL, () => HttpResponse.json(SeasonRecapVipResponseMock)),
    );

    const result = await runQuery({
      factory: () => query(),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal(SeasonRecapVipMappedMock);
  });

  it('should resolve to nothing for a season without a recap', async () => {
    server.use(
      http.get(URL, () =>
        HttpResponse.json({ error: 'recap_not_found' }, { status: 404 }),
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
    const vip = showSeasonRecapQuery({
      slug: 'severance',
      season: 1,
      isVip: true,
    });
    const standard = showSeasonRecapQuery({
      slug: 'severance',
      season: 1,
      isVip: false,
    });

    expect(vip.queryKey).not.to.deep.equal(standard.queryKey);
  });

  it('should refetch when the VIP status changes', () => {
    const { queryKey } = showSeasonRecapQuery({
      slug: 'severance',
      season: 1,
      isVip: true,
    });

    expect(queryKey).to.include(InvalidateAction.Vip.Updated);
  });
});
