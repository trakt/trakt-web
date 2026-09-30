import { describe, expect, it } from 'vitest';
import { stripOAuthParams } from './stripOAuthParams.ts';

describe('util: stripOAuthParams', () => {
  it('should remove the authorization code and state', () => {
    const result = stripOAuthParams(
      new URL('https://app.trakt.tv/callback/app/trakt?code=secret&state=xyz'),
    );

    expect(result.search).to.equal('');
  });

  it('should preserve non-OAuth params', () => {
    const result = stripOAuthParams(
      new URL('https://app.trakt.tv/callback?code=secret&utm_source=app'),
    );

    expect(result.searchParams.get('utm_source')).to.equal('app');
    expect(result.searchParams.has('code')).to.equal(false);
  });

  it('should not mutate the input url', () => {
    const input = new URL('https://app.trakt.tv/callback?code=secret');
    stripOAuthParams(input);

    expect(input.searchParams.get('code')).to.equal('secret');
  });
});
