import { UserHistoryMappedMock } from '$mocks/data/users/UserHistoryMappedMock';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { createQuery } from '@tanstack/svelte-query';
import { describe, expect, it } from 'vitest';
import { currentUserHistoryQuery } from './currentUserHistoryQuery';

describe('currentUserHistoryQuery', () => {
  it('should query for user user history', async () => {
    const result = await runQuery({
      factory: () => createQuery(currentUserHistoryQuery()),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal(UserHistoryMappedMock);
  });
});
