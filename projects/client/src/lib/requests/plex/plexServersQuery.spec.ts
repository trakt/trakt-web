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

  it('should return null when the request fails', async () => {
    server.use(
      http.get('http://localhost/users/settings/plex/servers', () => {
        return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }),
    );

    const result = await plexServersQuery();

    expect(result).toBeNull();
  });
});
