import { time } from '$lib/utils/timing/time.ts';
import { UpcomingMoviesMappedMock } from '$mocks/data/calendars/mapped/UpcomingMoviesMappedMock.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { createQuery } from '@tanstack/svelte-query';
import { describe, expect, it } from 'vitest';
import { upcomingMoviesQuery } from './upcomingMoviesQuery.ts';

describe('upcomingMoviesQuery', () => {
  it('should query upcoming movies', async () => {
    const result = await runQuery({
      factory: () =>
        createQuery(
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
