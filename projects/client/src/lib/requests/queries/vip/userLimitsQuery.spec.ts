import { UserLimitsMappedMock } from '$mocks/data/vip/mapped/UserLimitsMappedMock.ts';
import { createTestBedQuery } from '$test/beds/query/createTestBedQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { describe, expect, it } from 'vitest';
import { userLimitsQuery } from './userLimitsQuery.ts';

describe('userLimitsQuery', () => {
  it('should map user limits to the domain model, including connected apps', async () => {
    const result = await runQuery({
      factory: () => createTestBedQuery(userLimitsQuery({})),
      waitFor: (response) => Boolean(response.data),
    });

    expect(result.data).to.deep.equal(UserLimitsMappedMock);
  });
});
