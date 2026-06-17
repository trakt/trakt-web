import { PlexServerAccountsMappedMock } from '$mocks/data/plex/mapped/PlexServerAccountsMappedMock.ts';
import { serverId } from '$mocks/data/plex/response/PlexServerAccountsResponseMock.ts';
import { createTestBedQuery } from '$test/beds/query/createTestBedQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { describe, expect, it } from 'vitest';
import { plexServerAccountsQuery } from './plexServerAccountsQuery.ts';

describe('plexServerAccountsQuery', () => {
  it('should map selected to isSelected for libraries', async () => {
    const result = await runQuery({
      factory: () =>
        createTestBedQuery(
          plexServerAccountsQuery({ serverId }),
        ),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal(PlexServerAccountsMappedMock);
  });
});
