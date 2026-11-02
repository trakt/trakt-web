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
      { url: 'https://a', serverNames: ['A'], seenAt: null, refusal: null },
      { url: 'https://b', serverNames: ['B'], seenAt: null, refusal: null },
    ]);
  });

  it('gives each distinct address its own entry in connection order', () => {
    const result = toPlexWebhooks([
      { ...connection!, serverName: 'A', webhookUrl: 'https://a' },
      { ...connection!, id: 8, serverName: 'B', webhookUrl: 'https://b' },
    ]);

    expect(result).toEqual([
      { url: 'https://a', serverNames: ['A'], seenAt: null, refusal: null },
      { url: 'https://b', serverNames: ['B'], seenAt: null, refusal: null },
    ]);
  });

  it('groups active servers that share an address', () => {
    const result = toPlexWebhooks([
      { ...connection!, serverName: 'A', webhookUrl: 'https://a' },
      { ...connection!, id: 8, serverName: 'B', webhookUrl: 'https://a' },
    ]);

    expect(result).toEqual([
      {
        url: 'https://a',
        serverNames: ['A', 'B'],
        seenAt: null,
        refusal: null,
      },
    ]);
  });

  it('labels active servers without a name instead of dropping them', () => {
    const result = toPlexWebhooks([
      { ...connection!, serverName: null, webhookUrl: 'https://a' },
    ]);

    expect(result).toEqual([
      { url: 'https://a', serverNames: [UNNAMED], seenAt: null, refusal: null },
    ]);
  });

  it('carries when the last event arrived and why it was refused', () => {
    const seenAt = new Date('2026-10-05T09:30:00.000Z');
    const result = toPlexWebhooks([
      {
        ...connection!,
        webhookUrl: 'https://a',
        webhookSeenAt: seenAt,
        webhookRefusal: 'other_server',
      },
    ]);

    expect(result).toEqual([
      {
        url: 'https://a',
        serverNames: ['Living Room'],
        seenAt,
        refusal: 'other_server',
      },
    ]);
  });

  it('takes the most recent event and its refusal when servers share an address', () => {
    const older = new Date('2026-10-05T09:00:00.000Z');
    const newer = new Date('2026-10-05T10:00:00.000Z');
    const result = toPlexWebhooks([
      {
        ...connection!,
        webhookUrl: 'https://a',
        webhookSeenAt: older,
        webhookRefusal: 'not_vip',
      },
      {
        ...connection!,
        id: 8,
        webhookUrl: 'https://a',
        webhookSeenAt: newer,
        webhookRefusal: null,
      },
      { ...connection!, id: 9, webhookUrl: 'https://a' },
    ]);

    expect(result).toEqual([
      {
        url: 'https://a',
        serverNames: ['Living Room', 'Living Room', 'Living Room'],
        seenAt: newer,
        refusal: null,
      },
    ]);
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
    ).toEqual([
      {
        url: 'https://jellyfin',
        serverNames: ['Den'],
        seenAt: null,
        refusal: null,
      },
    ]);
  });
});
