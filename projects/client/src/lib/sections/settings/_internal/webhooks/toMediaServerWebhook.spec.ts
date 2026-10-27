import type { MediaSyncConnection } from '$lib/requests/media-sync/models/MediaSyncConnection.ts';
import { MediaSyncConnectionsMappedMock } from '$mocks/data/media-sync/mapped/MediaSyncConnectionsMappedMock.ts';
import { describe, expect, it } from 'vitest';
import { toMediaServerWebhook } from './toMediaServerWebhook.ts';

const [connection] = MediaSyncConnectionsMappedMock;
const UNNAMED = 'Media server';

function toPlexWebhooks(connections: MediaSyncConnection[] | undefined) {
  return toMediaServerWebhook({
    connections,
    provider: 'plex',
    unnamedServer: UNNAMED,
  });
}

describe('toMediaServerWebhook', () => {
  it('returns no entries while connections are loading', () => {
    expect(toPlexWebhooks(undefined)).toEqual([]);
  });

  it('returns no entries when no active connection exposes an address', () => {
    expect(toPlexWebhooks([{ ...connection!, webhookUrl: null }])).toEqual([]);
  });

  it('ignores inactive connections', () => {
    expect(toPlexWebhooks([{ ...connection!, status: 'paused' }])).toEqual([]);
  });

  it('includes webhook only connections', () => {
    const result = toPlexWebhooks([
      { ...connection!, serverName: 'A', webhookUrl: 'https://a' },
      {
        ...connection!,
        id: 8,
        serverName: 'B',
        status: 'webhook_only',
        webhookUrl: 'https://b',
      },
    ]);

    expect(result).toEqual([
      { url: 'https://a', serverNames: ['A'] },
      { url: 'https://b', serverNames: ['B'] },
    ]);
  });

  it('gives each distinct address its own entry in connection order', () => {
    const result = toPlexWebhooks([
      { ...connection!, serverName: 'A', webhookUrl: 'https://a' },
      { ...connection!, id: 8, serverName: 'B', webhookUrl: 'https://b' },
    ]);

    expect(result).toEqual([
      { url: 'https://a', serverNames: ['A'] },
      { url: 'https://b', serverNames: ['B'] },
    ]);
  });

  it('groups active servers that share an address', () => {
    const result = toPlexWebhooks([
      { ...connection!, serverName: 'A', webhookUrl: 'https://a' },
      { ...connection!, id: 8, serverName: 'B', webhookUrl: 'https://a' },
    ]);

    expect(result).toEqual([{ url: 'https://a', serverNames: ['A', 'B'] }]);
  });

  it('labels active servers without a name instead of dropping them', () => {
    const result = toPlexWebhooks([
      { ...connection!, serverName: null, webhookUrl: 'https://a' },
    ]);

    expect(result).toEqual([{ url: 'https://a', serverNames: [UNNAMED] }]);
  });

  it('only reads connections of the requested provider', () => {
    const connections = [
      { ...connection!, webhookUrl: 'https://plex' },
      {
        ...connection!,
        id: 9,
        provider: 'jellyfin' as const,
        serverName: 'Den',
        webhookUrl: 'https://jellyfin',
      },
    ];

    expect(
      toMediaServerWebhook({
        connections,
        provider: 'jellyfin',
        unnamedServer: UNNAMED,
      }),
    ).toEqual([{ url: 'https://jellyfin', serverNames: ['Den'] }]);
  });
});
