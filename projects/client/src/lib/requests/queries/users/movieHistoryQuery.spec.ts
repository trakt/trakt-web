import { time } from '$lib/utils/timing/time.ts';
import { HistoryMoviesMappedMock } from '$mocks/data/users/mapped/HistoryMoviesMappedMock.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { createQuery } from '@tanstack/svelte-query';
import { describe, expect, it } from 'vitest';
import { movieHistoryQuery } from './movieHistoryQuery.ts';

describe('movieHistoryQuery', () => {
  it('should query watched movies', async () => {
    const result = await runQuery({
      factory: () =>
        createQuery(
          movieHistoryQuery({
            startDate: new Date(Date.now() - time.months(1)),
            endDate: new Date(),
            limit: 10,
          }),
        ),
      mapper: (response) => response?.data?.entries,
    });

    expect(result).to.deep.equal(HistoryMoviesMappedMock);
  });
});
