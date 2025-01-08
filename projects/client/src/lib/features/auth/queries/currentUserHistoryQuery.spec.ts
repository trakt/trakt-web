import QueryTestBed from '$test/beds/query/QueryTestBed.svelte';

import { UserHistoryMappedMock } from '$mocks/data/users/UserHistoryMappedMock';
import { waitForQueryResult } from '$test/beds/query/waitForQueryResult.ts';
import { createQuery } from '@tanstack/svelte-query';
import { render } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import { currentUserHistoryQuery } from './currentUserHistoryQuery';

describe('currentUserHistoryQuery', () => {
  it('should query for user user history', async () => {
    render(QueryTestBed, {
      props: {
        queryFactory: () => createQuery(currentUserHistoryQuery()),
        mapper: (response) => response?.data,
      },
    });

    const result = await waitForQueryResult();
    expect(result).to.deep.equal(UserHistoryMappedMock);
  });
});
