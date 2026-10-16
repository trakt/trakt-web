import type { MediaSyncConnection } from '$lib/requests/media-sync/models/MediaSyncConnection.ts';

const WEBHOOK_STATUSES: ReadonlyArray<MediaSyncConnection['status']> = [
  'active',
  'webhook_only',
];

export type PlexWebhook = {
  url: string;
  serverNames: ReadonlyArray<string>;
};

export function toPlexWebhook(
  connections: MediaSyncConnection[] | undefined,
  unnamedServer: string,
): PlexWebhook | null {
  const eligible = (connections ?? []).filter((connection) =>
    connection.provider === 'plex' &&
    WEBHOOK_STATUSES.includes(connection.status)
  );
  const url = eligible.find((connection) => connection.webhookUrl)?.webhookUrl;

  if (!url) {
    return null;
  }

  return {
    url,
    serverNames: eligible.map((connection) =>
      connection.serverName || unnamedServer
    ),
  };
}
