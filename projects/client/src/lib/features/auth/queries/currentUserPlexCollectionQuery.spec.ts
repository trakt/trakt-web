import { UserPlexCollectionMappedMock } from '$mocks/data/users/mapped/UserPlexCollectionMappedMock.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { createQuery } from '@tanstack/svelte-query';
import { describe, expect, it } from 'vitest';
import { currentUserPlexCollectionQuery } from './currentUserPlexCollectionQuery.ts';

describe('currentUserPlexCollectionQuery', () => {
  it('should query for user plex collection', async () => {
    const result = await runQuery({
      factory: () => createQuery(currentUserPlexCollectionQuery()),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal(UserPlexCollectionMappedMock);
  });
});
