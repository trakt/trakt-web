import { describe, expect, it } from 'vitest';
import { isWebhookOnlyServer } from './isWebhookOnlyServer.ts';
import { PLEX_ACCOUNT_SERVER_ID } from './PLEX_ACCOUNT_SERVER_ID.ts';

const servers = [
  { id: 'open', reachable: true },
  { id: 'closed', reachable: false },
  { id: PLEX_ACCOUNT_SERVER_ID, reachable: false },
];

describe('isWebhookOnlyServer', () => {
  it('treats a server Trakt cannot reach as webhook only', () => {
    expect(isWebhookOnlyServer(servers, 'closed')).to.equal(true);
  });

  it('syncs a reachable server as usual', () => {
    expect(isWebhookOnlyServer(servers, 'open')).to.equal(false);
  });

  it('never applies to the watchlist or an unknown server', () => {
    expect(isWebhookOnlyServer(servers, PLEX_ACCOUNT_SERVER_ID)).to.equal(
      false,
    );
    expect(isWebhookOnlyServer(servers, 'missing')).to.equal(false);
    expect(isWebhookOnlyServer(servers, null)).to.equal(false);
  });
});
