import { time } from '$lib/utils/timing/time.ts';
import { HistoryEpisodesMappedMock } from '$mocks/data/users/mapped/HistoryEpisodesMappedMock.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { createQuery } from '@tanstack/svelte-query';
import { describe, expect, it } from 'vitest';
import { episodeHistoryQuery } from './episodeHistoryQuery.ts';

describe('episodeHistoryQuery', () => {
  it('should query watched episodes', async () => {
    const result = await runQuery({
      factory: () =>
        createQuery(
          episodeHistoryQuery({
            startDate: new Date(Date.now() - time.months(1)),
            endDate: new Date(),
            limit: 10,
          }),
        ),
      mapper: (response) => response?.data?.entries,
    });

    expect(result).to.deep.equal(HistoryEpisodesMappedMock);
  });
});
