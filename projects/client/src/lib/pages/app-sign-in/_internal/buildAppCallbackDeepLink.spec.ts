import { describe, expect, it } from 'vitest';
import { buildAppCallbackDeepLink } from './buildAppCallbackDeepLink.ts';

describe('buildAppCallbackDeepLink', () => {
  it('should hand the code and state to the Trakt app scheme', () => {
    const link = buildAppCallbackDeepLink(
      new URL('https://app.trakt.tv/callback/app/trakt?code=abc&state=xyz'),
    );

    expect(link).to.equal('trakt://auth?code=abc&state=xyz');
  });

  it('should return null without a code', () => {
    const link = buildAppCallbackDeepLink(
      new URL('https://app.trakt.tv/callback/app/trakt?state=xyz'),
    );

    expect(link).to.equal(null);
  });
});
