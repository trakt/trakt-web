import { ShowSiloMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloMappedMock.ts';
import { ShowSiloSentimentsMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloSentimentsMappedMock.ts';
import { createTestBedQuery } from '$test/beds/query/createTestBedQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { describe, expect, it } from 'vitest';
import { showSentimentsQuery } from './showSentimentsQuery.ts';

describe('showSentimentsQuery', () => {
  it('should query for show sentiments', async () => {
    const result = await runQuery({
      factory: () =>
        createTestBedQuery(
          showSentimentsQuery({ slug: ShowSiloMappedMock.slug }),
        ),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal(ShowSiloSentimentsMappedMock);
  });
});
