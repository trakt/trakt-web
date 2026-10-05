import z from 'zod';

const PLEX_PINS_URL = 'https://plex.tv/api/v2/pins?strong=true';

/**
 * The Trakt API only accepts PINs created under this client identifier and
 * product, and Plex shows the product name on its sign-in screen.
 */
const PLEX_CLIENT_HEADERS = {
  'Accept': 'application/json',
  'X-Plex-Client-Identifier': 'trakt-media-sync',
  'X-Plex-Product': 'Trakt Media Sync',
};

const PlexPinSchema = z.object({ id: z.number(), code: z.string() });

export type PlexPin = z.infer<typeof PlexPinSchema>;

export async function createPlexPinRequest(
  { fetch = globalThis.fetch }: { fetch?: typeof globalThis.fetch } = {},
): Promise<PlexPin> {
  const response = await fetch(PLEX_PINS_URL, {
    method: 'POST',
    headers: PLEX_CLIENT_HEADERS,
  });
  if (!response.ok) {
    throw new Error(`Failed to start Plex sign-in: ${response.status}`);
  }
  return PlexPinSchema.parse(await response.json());
}
