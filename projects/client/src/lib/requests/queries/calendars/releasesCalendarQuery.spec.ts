import { time } from '$lib/utils/timing/time.ts';
import { UpcomingEpisodesMappedMock } from '$mocks/data/calendars/mapped/UpcomingEpisodesMappedMock.ts';
import { UpcomingMoviesMappedMock } from '$mocks/data/calendars/mapped/UpcomingMoviesMappedMock.ts';
import { createTestBedQuery } from '$test/beds/query/createTestBedQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { describe, expect, it } from 'vitest';
import { releasesCalendarQuery } from './releasesCalendarQuery.ts';

describe('releasesCalendarQuery', () => {
  it('should merge the hot releases feed into mapped calendar entries', async () => {
    const result = await runQuery({
      factory: () =>
        createTestBedQuery(
          releasesCalendarQuery({
            startDate: new Date(Date.now() - time.days(1)).toISOString(),
            days: 30,
            type: 'media',
          }),
        ),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal([
      ...UpcomingEpisodesMappedMock,
      ...UpcomingMoviesMappedMock,
    ]);
  });
});
