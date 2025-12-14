import { UserWatchingMappedMock } from '$mocks/data/users/mapped/UserWatchingMappedMock.ts';
import { createTestBedQuery } from '$test/beds/query/createTestBedQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { describe, expect, it } from 'vitest';
import { userWatchingQuery } from './userWatchingQuery.ts';

describe('userWatchingQuery', () => {
  it('should query what the user is watching', async () => {
    const result = await runQuery({
      factory: () =>
        createTestBedQuery(
          userWatchingQuery({
            slug: 'me',
          }),
        ),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal(UserWatchingMappedMock);
  });
});
