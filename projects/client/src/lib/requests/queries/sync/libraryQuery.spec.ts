import { LibraryMappedMock } from '$mocks/data/sync/mapped/LibraryMappedMock.ts';
import { createTestBedQuery } from '$test/beds/query/createTestBedQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { describe, expect, it } from 'vitest';
import { libraryQuery } from './libraryQuery.ts';

describe('libraryQuery', () => {
  it('should query library', async () => {
    const result = await runQuery({
      factory: () =>
        createTestBedQuery(
          libraryQuery(),
        ),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal(LibraryMappedMock);
  });
});
