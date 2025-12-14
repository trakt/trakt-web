import { UpNextMappedMock } from '$mocks/data/sync/mapped/UpNextMappedMock.ts';
import { createTestBedInfiniteQuery } from '$test/beds/query/createTestBedInfiniteQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { mapToEntries } from '$test/utils/mapToEntries.ts';
import { describe, expect, it } from 'vitest';
import { upNextNitroQuery } from './upNextNitroQuery.ts';

describe('upNextNitroQuery', () => {
  it('should query up next', async () => {
    const result = await runQuery({
      factory: () =>
        createTestBedInfiniteQuery(
          upNextNitroQuery(),
        ),
      mapper: mapToEntries,
    });

    expect(result).to.deep.equal(UpNextMappedMock);
  });
});
