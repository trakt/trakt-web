import { UserMonthInReviewMappedMock } from '$mocks/data/users/mapped/UserMonthInReviewMappedMock.ts';
import { createTestBedQuery } from '$test/beds/query/createTestBedQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { describe, expect, it } from 'vitest';
import { monthInReviewQuery } from './monthInReviewQuery.ts';

describe('monthInReviewQuery', () => {
  it('should query month in review', async () => {
    const result = await runQuery({
      factory: () =>
        createTestBedQuery(
          monthInReviewQuery({
            slug: 'me',
            month: 1,
            year: 2023,
          }),
        ),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal(UserMonthInReviewMappedMock);
  });
});
