import { time } from '$lib/utils/timing/time.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { mapToEntries } from '$test/utils/mapToEntries.ts';
import { createInfiniteQuery } from '@tanstack/svelte-query';
import { describe, expect, it } from 'vitest';
import { ShowActivityHistoryMappedMock } from '../../../../mocks/data/users/mapped/ShowActivityHistoryMappedMock.ts';
import { showActivityHistoryQuery } from './showActivityHistoryQuery.ts';

describe('showActivityHistoryQuery', () => {
  it('should query watched shows', async () => {
    const result = await runQuery({
      factory: () =>
        createInfiniteQuery(
          showActivityHistoryQuery({
            slug: 'me',
            startDate: new Date(Date.now() - time.months(1)),
            endDate: new Date(),
            limit: 10,
          }),
        ),
      mapper: mapToEntries,
    });

    expect(result).to.deep.equal(ShowActivityHistoryMappedMock);
  });
});
