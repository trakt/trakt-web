import { PromotionsMappedMock } from '$mocks/data/promotions/mapped/PromotionsMappedMock.ts';
import { server } from '$mocks/server.ts';
import { createTestBedQuery } from '$test/beds/query/createTestBedQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { promotionsQuery } from './promotionsQuery.ts';

describe('promotionsQuery', () => {
  it('should map the promotions to offers', async () => {
    const result = await runQuery({
      factory: () => createTestBedQuery(promotionsQuery()),
      mapper: (response) => response?.data,
    });

    expect(result).toEqual(PromotionsMappedMock);
  });

  it('should return no offers when none are active', async () => {
    server.use(
      http.get('http://localhost/vip/promotions', () => HttpResponse.json([])),
    );

    const result = await runQuery({
      factory: () => createTestBedQuery(promotionsQuery()),
      mapper: (response) => response?.data,
    });

    expect(result).toEqual([]);
  });

  it('should return no offers when the request fails', async () => {
    server.use(
      http.get('http://localhost/vip/promotions', () =>
        HttpResponse.json({}, { status: 500 }),
      ),
    );

    const result = await runQuery({
      factory: () => createTestBedQuery(promotionsQuery()),
      mapper: (response) => response?.data,
    });

    expect(result).toEqual([]);
  });
});
