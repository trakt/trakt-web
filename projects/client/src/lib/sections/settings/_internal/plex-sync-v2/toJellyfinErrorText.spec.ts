import { describe, expect, it } from 'vitest';
import { toJellyfinErrorText } from './toJellyfinErrorText.ts';

describe('toJellyfinErrorText', () => {
  it('explains an unreachable server', () => {
    expect(toJellyfinErrorText('server_unreachable')).to.equal(
      "Trakt can't reach that server. Make sure it's online and reachable from the internet.",
    );
  });

  it('explains a rejected address', () => {
    expect(toJellyfinErrorText('raw_ip_address')).to.equal(
      "Use your server's domain name. Trakt can't reach a bare IP address.",
    );
  });

  it('treats a provider credential rejection as wrong credentials', () => {
    expect(toJellyfinErrorText('provider_rejected_credentials')).to.equal(
      toJellyfinErrorText('invalid_credentials'),
    );
  });

  it('points to Password when Quick Connect is off', () => {
    expect(toJellyfinErrorText('quick_connect_disabled')).to.equal(
      'Quick Connect is off on this server. Turn it on in the Jellyfin dashboard, or sign in with your password.',
    );
  });

  it('names a media server, not Plex, when the server limit is reached', () => {
    expect(toJellyfinErrorText('server_limit_reached')).to.equal(
      'Free accounts can sync 1 media server. Go VIP to add more.',
    );
  });

  it('falls back to the generic error for unknown codes', () => {
    expect(toJellyfinErrorText('http_500')).to.equal(
      'Something went wrong. Try again in a moment.',
    );
  });
});
