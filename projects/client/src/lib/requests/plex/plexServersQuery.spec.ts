import { PlexServersMappedMock } from '$mocks/data/plex/mapped/PlexServersMappedMock.ts';
import { server } from '$mocks/server.ts';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { plexServersQuery } from './plexServersQuery.ts';

describe('plexServersQuery', () => {
  it('should return the servers array', async () => {
    const result = await plexServersQuery();

    expect(result).to.deep.equal(PlexServersMappedMock);
  });

  it('should throw when the request fails', async () => {
    server.use(
      http.get('http://localhost/users/settings/plex/servers', () => {
        return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }),
    );

    await expect(plexServersQuery()).rejects.toThrow(
      'Failed to load Plex servers: 401',
    );
  });

  it('should throw when the request times out at the edge', async () => {
    server.use(
      http.get('http://localhost/users/settings/plex/servers', () => {
        return new HttpResponse('Gateway Timeout', { status: 504 });
      }),
    );

    await expect(plexServersQuery()).rejects.toThrow(
      'Failed to load Plex servers: 504',
    );
  });
});
