import { describe, expect, it } from 'vitest';
import { PLEX_ACCOUNT_SERVER_ID } from './PLEX_ACCOUNT_SERVER_ID.ts';
import { toAvailableFeeds } from './toAvailableFeeds.ts';

describe('toAvailableFeeds', () => {
  it('offers every feed for a Plex server', () => {
    expect(
      toAvailableFeeds({ provider: 'plex', serverId: 'server-1' }),
    ).to.deep.equal(['history', 'ratings', 'collection', 'watchlist']);
  });

  it('offers only the watchlist for a watchlist-only Plex connection', () => {
    expect(
      toAvailableFeeds({ provider: 'plex', serverId: PLEX_ACCOUNT_SERVER_ID }),
    ).to.deep.equal(['watchlist']);
  });

  it('offers history and collection for a Jellyfin server', () => {
    expect(
      toAvailableFeeds({ provider: 'jellyfin', serverId: 'jf-1' }),
    ).to.deep.equal(['history', 'collection']);
  });
});
