import { GifTrendingMappedMock } from '$mocks/data/gifs/mapped/GifTrendingMappedMock.ts';
import { createTestBedInfiniteQuery } from '$test/beds/query/createTestBedInfiniteQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { mapToEntries } from '$test/utils/mapToEntries.ts';
import { describe, expect, it } from 'vitest';
import { gifTrendingQuery } from './gifTrendingQuery.ts';

describe('gifTrendingQuery', () => {
  it('should query for trending gifs', async () => {
    const result = await runQuery({
      factory: () =>
        createTestBedInfiniteQuery(gifTrendingQuery({
          customerId: 'test-device',
          limit: 24,
        })),
      mapper: mapToEntries,
    });

    expect(result).to.deep.equal(GifTrendingMappedMock);
  });

  it('should drop the sponsored entries klipy mixes in', async () => {
    const result = await runQuery({
      factory: () =>
        createTestBedInfiniteQuery(gifTrendingQuery({
          customerId: 'test-device',
          limit: 24,
        })),
      mapper: mapToEntries,
    });

    expect(result).to.have.lengthOf(1);
  });
});
