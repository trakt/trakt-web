import type { StreamingConnection } from '$lib/requests/models/StreamingConnection.ts';
import { prependHttps } from '$lib/utils/url/prependHttps.ts';
import type { YounifyConnection } from '@trakt/api';

function mapToColor(color: string | Nil): string | undefined {
  const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;

  if (!color || !hexColorRegex.test(color)) {
    return undefined;
  }

  return color;
}

export function mapToStreamingConnection(
  connection: YounifyConnection,
): StreamingConnection {
  return {
    id: connection.id,
    key: `streaming-connection-${connection.id}`,
    name: connection.name,
    isVip: connection.vip,
    color: mapToColor(connection.color),
    logoUrl: prependHttps(connection.images?.logo),
    isConnectable: connection.connectable,
    isConnected: connection.connected,
    isActive: connection.active,
    profile: connection.profile,
    lastSyncedAt: connection.last_synced_at
      ? new Date(connection.last_synced_at)
      : undefined,
  };
}
