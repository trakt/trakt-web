import { PlexServerAccountsMappedMock } from '$mocks/data/plex/mapped/PlexServerAccountsMappedMock.ts';
import { serverId } from '$mocks/data/plex/response/PlexServerAccountsResponseMock.ts';
import { server } from '$mocks/server.ts';
import { createTestBedQuery } from '$test/beds/query/createTestBedQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { http, HttpResponse } from 'msw';
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

  it('should report a per-user plex failure as data, not as an error', async () => {
    const unreachableServerId = 'unreachable-server';
    server.use(
      http.get(
        `http://localhost/users/settings/plex/servers/${unreachableServerId}`,
        () =>
          HttpResponse.json(
            {
              error_code: 'invalid_server_url',
              message: "Trakt can't reach this Plex media server.",
              guidance: 'Please make sure remote access is enabled.',
            },
            { status: 503 },
          ),
      ),
    );

    const result = await runQuery({
      factory: () =>
        createTestBedQuery(
          plexServerAccountsQuery({ serverId: unreachableServerId }),
        ),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal({ errorCode: 'invalid_server_url' });
  });

  it('should fall back to unknown for an unrecognized plex error code', async () => {
    const futureCodeServerId = 'future-code-server';
    server.use(
      http.get(
        `http://localhost/users/settings/plex/servers/${futureCodeServerId}`,
        () =>
          HttpResponse.json(
            {
              error_code: 'plex_went_to_the_moon',
              message: 'Something new happened.',
              guidance: 'Please try again later.',
            },
            { status: 503 },
          ),
      ),
    );

    const result = await runQuery({
      factory: () =>
        createTestBedQuery(
          plexServerAccountsQuery({ serverId: futureCodeServerId }),
        ),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal({ errorCode: 'unknown' });
  });

  it('should keep an error response without the plex envelope as a query error', async () => {
    const outageServerId = 'outage-server';
    server.use(
      http.get(
        `http://localhost/users/settings/plex/servers/${outageServerId}`,
        () => HttpResponse.json({}, { status: 503 }),
      ),
    );

    await expect(
      plexServerAccountsQuery({ serverId: outageServerId }).execute(),
    ).rejects.toThrow();
  });
});
