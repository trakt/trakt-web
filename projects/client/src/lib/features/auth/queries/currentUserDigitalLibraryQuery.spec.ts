import { UserDigitalLibraryMappedMock } from '$mocks/data/users/mapped/UserDigitalLibraryMappedMock.ts';
import { createTestBedQuery } from '$test/beds/query/createTestBedQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { describe, expect, it } from 'vitest';
import { currentUserDigitalLibraryQuery } from './currentUserDigitalLibraryQuery.ts';

describe('currentUserDigitalLibraryQuery', () => {
  it('should query for user digital library', async () => {
    const result = await runQuery({
      factory: () => createTestBedQuery(currentUserDigitalLibraryQuery()),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal(UserDigitalLibraryMappedMock);
  });
});
