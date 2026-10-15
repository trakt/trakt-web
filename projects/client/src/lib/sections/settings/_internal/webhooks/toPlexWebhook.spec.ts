import { MediaSyncConnectionsMappedMock } from '$mocks/data/media-sync/mapped/MediaSyncConnectionsMappedMock.ts';
import { describe, expect, it } from 'vitest';
import { toPlexWebhook } from './toPlexWebhook.ts';

const [connection] = MediaSyncConnectionsMappedMock;
const UNNAMED = 'Plex server';

describe('toPlexWebhook', () => {
  it('returns null while connections are loading', () => {
    expect(toPlexWebhook(undefined, UNNAMED)).toBeNull();
  });

  it('returns null when no active plex connection exposes an address', () => {
    expect(toPlexWebhook([{ ...connection!, webhookUrl: null }], UNNAMED))
      .toBeNull();
  });

  it('ignores inactive connections', () => {
    expect(toPlexWebhook([{ ...connection!, status: 'paused' }], UNNAMED))
      .toBeNull();
  });

  it('uses the first active address and lists active server names', () => {
    const result = toPlexWebhook([
      { ...connection!, serverName: 'A', webhookUrl: 'https://a' },
      { ...connection!, id: 8, serverName: 'B', webhookUrl: 'https://b' },
    ], UNNAMED);

    expect(result).toEqual({ url: 'https://a', serverNames: ['A', 'B'] });
  });

  it('labels active servers without a name instead of dropping them', () => {
    const result = toPlexWebhook(
      [{ ...connection!, serverName: null, webhookUrl: 'https://a' }],
      UNNAMED,
    );

    expect(result).toEqual({ url: 'https://a', serverNames: [UNNAMED] });
  });
});
