import type { MediaSyncConnection } from '$lib/requests/media-sync/models/MediaSyncConnection.ts';
import type { MediaServerWebhook } from './MediaServerWebhook.ts';

const WEBHOOK_STATUSES: ReadonlyArray<MediaSyncConnection['status']> = [
  'active',
  'webhook_only',
];

export function toMediaServerWebhook({
  connections,
  provider,
  unnamedServer,
}: {
  connections: MediaSyncConnection[] | undefined;
  provider: MediaSyncConnection['provider'];
  unnamedServer: string;
}): ReadonlyArray<MediaServerWebhook> {
  const addressed = (connections ?? []).flatMap((connection) =>
    connection.provider === provider &&
    WEBHOOK_STATUSES.includes(connection.status) &&
    connection.webhookUrl
      ? [
          {
            url: connection.webhookUrl,
            serverName: connection.serverName || unnamedServer,
          },
        ]
      : [],
  );
  const urls = [...new Set(addressed.map(({ url }) => url))];

  return urls.map((url) => ({
    url,
    serverNames: addressed
      .filter((entry) => entry.url === url)
      .map(({ serverName }) => serverName),
  }));
}
