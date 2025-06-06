import { UserNetworkMappedMock } from '$mocks/data/users/mapped/UserNetworkMappedMock.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { createQuery } from '@tanstack/svelte-query';
import { describe, expect, it } from 'vitest';
import { currentUserNetworkQuery } from './currentUserNetworkQuery.ts';

describe('currentUserNetworkQuery', () => {
  it('should query for user network', async () => {
    const result = await runQuery({
      factory: () => createQuery(currentUserNetworkQuery()),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal(UserNetworkMappedMock);
  });
});
