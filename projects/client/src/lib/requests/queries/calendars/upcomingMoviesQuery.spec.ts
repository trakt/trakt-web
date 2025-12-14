import { time } from '$lib/utils/timing/time.ts';
import { UpcomingMoviesMappedMock } from '$mocks/data/calendars/mapped/UpcomingMoviesMappedMock.ts';
import { createTestBedQuery } from '$test/beds/query/createTestBedQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { describe, expect, it } from 'vitest';
import { upcomingMoviesQuery } from './upcomingMoviesQuery.ts';

describe('upcomingMoviesQuery', () => {
  it('should query upcoming movies', async () => {
    const result = await runQuery({
      factory: () =>
        createTestBedQuery(
          upcomingMoviesQuery({
            startDate: new Date(Date.now() - time.days(1)).toISOString(),
            days: 30,
          }),
        ),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal(UpcomingMoviesMappedMock);
  });
});
