import { time } from '$lib/utils/timing/time.ts';
import { HistoryShowsMappedMock } from '$mocks/data/users/mapped/HistoryShowsMappedMock.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { createQuery } from '@tanstack/svelte-query';
import { describe, expect, it } from 'vitest';
import { showHistoryQuery } from './showHistoryQuery.ts';

describe('showHistoryQuery', () => {
  it('should query watched shows', async () => {
    const result = await runQuery({
      factory: () =>
        createQuery(
          showHistoryQuery({
            startDate: new Date(Date.now() - time.months(1)),
            endDate: new Date(),
            limit: 10,
          }),
        ),
      mapper: (response) => response?.data?.entries,
    });

    expect(result).to.deep.equal(HistoryShowsMappedMock);
  });
});
