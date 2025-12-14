import { ShowSiloMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloMappedMock.ts';
import { createTestBedQuery } from '$test/beds/query/createTestBedQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { describe, expect, it } from 'vitest';
import { ShowSiloStreamingServiceOptionsMappedMock } from '../../../../mocks/data/summary/shows/silo/mapped/ShowSiloStreamingServiceOptionsMappedMock.ts';
import { streamShowQuery } from './streamShowQuery.ts';

describe('streamShowQuery', () => {
  it('should query for Silo (2023)', async () => {
    const result = await runQuery({
      factory: () =>
        createTestBedQuery(
          streamShowQuery({ slug: ShowSiloMappedMock.slug, country: 'us' }),
        ),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal(ShowSiloStreamingServiceOptionsMappedMock);
  });
});
