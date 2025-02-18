import { time } from '$lib/utils/timing/time.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { createQuery } from '@tanstack/svelte-query';
import { describe, expect, it } from 'vitest';
import { MovieActivityHistoryMappedMock } from '../../../../mocks/data/users/mapped/MovieActivityHistoryMappedMock.ts';
import { movieActivityHistoryQuery } from './movieActivityHistoryQuery.ts';

describe('movieActivityHistoryQuery', () => {
  it('should query watched movies', async () => {
    const result = await runQuery({
      factory: () =>
        createQuery(
          movieActivityHistoryQuery({
            startDate: new Date(Date.now() - time.months(1)),
            endDate: new Date(),
            limit: 10,
          }),
        ),
      mapper: (response) => response?.data?.entries,
    });

    expect(result).to.deep.equal(MovieActivityHistoryMappedMock);
  });
});
