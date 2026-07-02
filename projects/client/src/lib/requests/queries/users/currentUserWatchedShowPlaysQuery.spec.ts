import { WatchedShowPlaysMappedMock } from '$mocks/data/users/mapped/WatchedShowPlaysMappedMock.ts';
import { createTestBedQuery } from '$test/beds/query/createTestBedQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { describe, expect, it } from 'vitest';
import { currentUserWatchedShowPlaysQuery } from './currentUserWatchedShowPlaysQuery.ts';

describe('currentUserWatchedShowPlaysQuery', () => {
  it('should flatten show plays to episode plays sorted by most recent watch', async () => {
    const result = await runQuery({
      factory: () => createTestBedQuery(currentUserWatchedShowPlaysQuery({})),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal(WatchedShowPlaysMappedMock);
  });
});
