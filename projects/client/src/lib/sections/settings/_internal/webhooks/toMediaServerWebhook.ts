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
            seenAt: connection.webhookSeenAt,
            refusal: connection.webhookRefusal,
          },
        ]
      : [],
  );
  const urls = [...new Set(addressed.map(({ url }) => url))];

  return urls.map((url) => {
    const entries = addressed.filter((entry) => entry.url === url);
    const latest = entries.reduce((best, entry) =>
      (entry.seenAt?.getTime() ?? -Infinity) >
      (best.seenAt?.getTime() ?? -Infinity)
        ? entry
        : best,
    );

    return {
      url,
      serverNames: entries.map(({ serverName }) => serverName),
      seenAt: latest.seenAt,
      refusal: latest.refusal,
    };
  });
}
