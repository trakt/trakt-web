import type { MediaSyncConnection } from '$lib/requests/media-sync/models/MediaSyncConnection.ts';

export type PlexWebhook = {
  url: string;
  serverNames: ReadonlyArray<string>;
};

export function toPlexWebhook(
  connections: MediaSyncConnection[] | undefined,
  unnamedServer: string,
): PlexWebhook | null {
  const active = (connections ?? []).filter((connection) =>
    connection.provider === 'plex' && connection.status === 'active'
  );
  const url = active.find((connection) => connection.webhookUrl)?.webhookUrl;

  if (!url) {
    return null;
  }

  return {
    url,
    serverNames: active.map((connection) =>
      connection.serverName || unnamedServer
    ),
  };
}
