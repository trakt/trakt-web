import { LibraryMappedMock } from '$mocks/data/sync/mapped/LibraryMappedMock.ts';
import { createTestBedInfiniteQuery } from '$test/beds/query/createTestBedInfiniteQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { mapToEntries } from '$test/utils/mapToEntries.ts';
import { describe, expect, it } from 'vitest';
import { libraryQuery } from './libraryQuery.ts';

describe('libraryQuery', () => {
  it('should query library', async () => {
    const result = await runQuery({
      factory: () =>
        createTestBedInfiniteQuery(
          libraryQuery(),
        ),
      mapper: mapToEntries,
    });

    expect(result).to.deep.equal(LibraryMappedMock);
  });
});
