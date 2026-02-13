import { ShowSiloMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloMappedMock.ts';
import { ShowSiloSentimentMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloSentimentMappedMock.ts';
import { createTestBedQuery } from '$test/beds/query/createTestBedQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { describe, expect, it } from 'vitest';
import { showSentimentQuery } from './showSentimentQuery.ts';

describe('showSentimentQuery', () => {
  it('should query for show sentiment', async () => {
    const result = await runQuery({
      factory: () =>
        createTestBedQuery(
          showSentimentQuery({ slug: ShowSiloMappedMock.slug }),
        ),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal(ShowSiloSentimentMappedMock);
  });
});
