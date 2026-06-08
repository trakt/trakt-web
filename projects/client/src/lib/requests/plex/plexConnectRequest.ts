import { api, type ApiParams } from '$lib/requests/api.ts';

type PlexConnectParams = {
  returnUrl: string;
} & ApiParams;

export async function plexConnectRequest(
  { returnUrl, fetch }: PlexConnectParams,
): Promise<string | null> {
  const response = await api({ fetch }).users.plex.connect({
    body: { return_url: returnUrl },
  });

  if (response.status !== 200) return null;
  return response.body.url;
}
