import { type ApiParams, rawApiFetch } from '$lib/requests/api.ts';
import z from 'zod';

const PlexLibraryOptionSchema = z.object({
  external_id: z.string(),
  kind: z.enum(['movies', 'shows']),
  title: z.string(),
  item_count: z.number().nullable(),
});

export type PlexLibraryOption = {
  externalId: string;
  kind: 'movies' | 'shows';
  title: string;
  itemCount: number | null;
};

export async function plexServerLibrariesRequest(
  { fetch, attemptId, serverId }:
    & { attemptId: string; serverId: string }
    & ApiParams,
): Promise<PlexLibraryOption[]> {
  const response = await rawApiFetch({
    fetch,
    path: `/v3/users/me/sync/plex/pin/${attemptId}/servers/${
      encodeURIComponent(serverId)
    }/libraries`,
  });
  if (!response.ok) {
    throw new Error(`Failed to load Plex libraries: ${response.status}`);
  }
  return z.array(PlexLibraryOptionSchema).parse(await response.json()).map(
    (library) => ({
      externalId: library.external_id,
      kind: library.kind,
      title: library.title,
      itemCount: library.item_count,
    }),
  );
}
