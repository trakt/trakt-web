import { time } from '$lib/utils/timing/time.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { mapToEntries } from '$test/utils/mapToEntries.ts';
import { createInfiniteQuery } from '@tanstack/svelte-query';
import { describe, expect, it } from 'vitest';
import { EpisodeActivityHistoryMappedMock } from '../../../../mocks/data/users/mapped/EpisodeActivityHistoryMappedMock.ts';
import { episodeActivityHistoryQuery } from './episodeActivityHistoryQuery.ts';

describe('episodeActivityHistoryQuery', () => {
  it('should query watched episodes', async () => {
    const result = await runQuery({
      factory: () =>
        createInfiniteQuery(
          episodeActivityHistoryQuery({
            slug: 'me',
            startDate: new Date(Date.now() - time.months(1)),
            endDate: new Date(),
            limit: 10,
          }),
        ),
      mapper: mapToEntries,
    });

    expect(result).to.deep.equal(EpisodeActivityHistoryMappedMock);
  });
});
