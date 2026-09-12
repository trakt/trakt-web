import { GifTrendingMappedMock } from '$mocks/data/gifs/mapped/GifTrendingMappedMock.ts';
import { createTestBedInfiniteQuery } from '$test/beds/query/createTestBedInfiniteQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { mapToEntries } from '$test/utils/mapToEntries.ts';
import { describe, expect, it } from 'vitest';
import { gifSearchQuery } from './gifSearchQuery.ts';

describe('gifSearchQuery', () => {
  it('should query for gifs matching the term', async () => {
    const result = await runQuery({
      factory: () =>
        createTestBedInfiniteQuery(gifSearchQuery({
          query: 'thursday',
          customerId: 'test-device',
          limit: 24,
        })),
      mapper: mapToEntries,
    });

    expect(result).to.deep.equal(GifTrendingMappedMock);
  });

  it('should return nothing for a term klipy has no gifs for', async () => {
    const result = await runQuery({
      factory: () =>
        createTestBedInfiniteQuery(gifSearchQuery({
          query: 'nothing here',
          customerId: 'test-device',
          limit: 24,
        })),
      mapper: mapToEntries,
    });

    expect(result).to.deep.equal([]);
  });
});
