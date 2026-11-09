import { server } from '$mocks/server.ts';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { PlexServerUnreachableError } from './models/PlexServerUnreachableError.ts';
import { plexServerLibrariesRequest } from './plexServerLibrariesRequest.ts';

const URL =
  'http://localhost/v3/users/me/sync/plex/pin/42/servers/abc/libraries';

function request() {
  return plexServerLibrariesRequest({ attemptId: '42', serverId: 'abc' });
}

describe('plexServerLibrariesRequest', () => {
  it('should flag a server the API cannot reach', async () => {
    server.use(http.get(URL, () => new HttpResponse(null, { status: 504 })));

    await expect(request()).rejects.toBeInstanceOf(PlexServerUnreachableError);
  });

  it('should keep other failures generic', async () => {
    server.use(http.get(URL, () => new HttpResponse(null, { status: 502 })));

    const error = await request().catch((error: unknown) => error);
    expect(error).toBeInstanceOf(Error);
    expect(error).not.toBeInstanceOf(PlexServerUnreachableError);
  });
});
