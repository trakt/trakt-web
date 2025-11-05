import { UserPlexLibraryMappedMock } from '$mocks/data/users/mapped/UserPlexLibraryMappedMock.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { createQuery } from '@tanstack/svelte-query';
import { describe, expect, it } from 'vitest';
import { currentUserPlexLibraryQuery } from './currentUserPlexLibraryQuery.ts';

describe('currentUserPlexLibraryQuery', () => {
  it('should query for user plex library', async () => {
    const result = await runQuery({
      factory: () => createQuery(currentUserPlexLibraryQuery()),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal(UserPlexLibraryMappedMock);
  });
});
