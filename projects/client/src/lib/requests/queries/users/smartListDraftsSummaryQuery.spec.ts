import { server } from '$mocks/server.ts';
import { SmartListDraftsSummaryMappedMock } from '$mocks/data/users/mapped/SmartListDraftsSummaryMappedMock.ts';
import { createTestBedQuery } from '$test/beds/query/createTestBedQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { smartListDraftsSummaryQuery } from './smartListDraftsSummaryQuery.ts';

describe('smartListDraftsSummaryQuery', () => {
  it('should map the summary', async () => {
    const result = await runQuery({
      factory: () => createTestBedQuery(smartListDraftsSummaryQuery()),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal(SmartListDraftsSummaryMappedMock);
  });

  it('should map an account with nothing to convert', async () => {
    server.use(
      http.get(
        'http://localhost/users/me/smart-list-drafts',
        () =>
          HttpResponse.json({
            convertible_count: 0,
            best_confidence: null,
            lists: [],
          }),
      ),
    );

    const result = await runQuery({
      factory: () => createTestBedQuery(smartListDraftsSummaryQuery()),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal({
      convertibleCount: 0,
      bestConfidence: null,
      lists: [],
    });
  });
});
