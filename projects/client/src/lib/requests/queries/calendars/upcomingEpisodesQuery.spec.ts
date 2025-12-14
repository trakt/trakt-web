import { time } from '$lib/utils/timing/time.ts';
import { UpcomingEpisodesMappedMock } from '$mocks/data/calendars/mapped/UpcomingEpisodesMappedMock.ts';
import { createTestBedQuery } from '$test/beds/query/createTestBedQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { describe, expect, it } from 'vitest';
import { upcomingEpisodesQuery } from './upcomingEpisodesQuery.ts';

describe('upcomingEpisodesQuery', () => {
  it('should query upcoming episodes', async () => {
    const result = await runQuery({
      factory: () =>
        createTestBedQuery(
          upcomingEpisodesQuery({
            startDate: new Date(Date.now() - time.days(1)).toISOString(),
            days: 30,
          }),
        ),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal(UpcomingEpisodesMappedMock);
  });
});
