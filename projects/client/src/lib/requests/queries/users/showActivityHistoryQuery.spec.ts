import { time } from '$lib/utils/timing/time.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { createQuery } from '@tanstack/svelte-query';
import { describe, expect, it } from 'vitest';
import { ShowActivityHistoryMappedMock } from '../../../../mocks/data/users/mapped/ShowActivityHistoryMappedMock.ts';
import { showActivityHistoryQuery } from './showActivityHistoryQuery.ts';

describe('showActivityHistoryQuery', () => {
  it('should query watched shows', async () => {
    const result = await runQuery({
      factory: () =>
        createQuery(
          showActivityHistoryQuery({
            startDate: new Date(Date.now() - time.months(1)),
            endDate: new Date(),
            limit: 10,
          }),
        ),
      mapper: (response) => response?.data?.entries,
    });

    expect(result).to.deep.equal(ShowActivityHistoryMappedMock);
  });
});
