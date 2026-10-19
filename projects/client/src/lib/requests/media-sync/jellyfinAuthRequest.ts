import { type ApiParams, rawApiFetch } from '$lib/requests/api.ts';
import { parseJellyfinAuth } from './_internal/parseJellyfinAuth.ts';
import { readMediaSyncError } from './_internal/readMediaSyncError.ts';
import type { JellyfinAuth } from './models/JellyfinAuth.ts';
import type { MediaSyncResult } from './models/MediaSyncResult.ts';

export type JellyfinSignIn =
  | { method: 'quick-connect'; serverUrl: string }
  | {
      method: 'password';
      serverUrl: string;
      username: string;
      password: string;
    };

function toBody(signIn: JellyfinSignIn) {
  return signIn.method === 'quick-connect'
    ? { server_url: signIn.serverUrl, quick_connect: true }
    : {
        server_url: signIn.serverUrl,
        username: signIn.username,
        password: signIn.password,
      };
}

export async function jellyfinAuthRequest({
  fetch,
  signIn,
}: { signIn: JellyfinSignIn } & ApiParams): Promise<
  MediaSyncResult<JellyfinAuth>
> {
  const response = await rawApiFetch({
    fetch,
    path: '/v3/users/me/sync/jellyfin/auth',
    init: {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(toBody(signIn)),
    },
  });
  if (!response.ok) {
    return { ok: false, error: await readMediaSyncError(response) };
  }
  return { ok: true, value: parseJellyfinAuth(await response.json()) };
}
