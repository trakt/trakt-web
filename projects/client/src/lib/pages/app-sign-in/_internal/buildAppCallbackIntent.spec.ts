import { describe, expect, it } from 'vitest';
import { buildAppCallbackIntent } from './buildAppCallbackIntent.ts';

const FALLBACK = 'https://play.google.com/store/apps/details?id=tv.trakt.trakt';

describe('buildAppCallbackIntent', () => {
  it('should hand the callback, code included, to the Trakt package', () => {
    const intent = buildAppCallbackIntent(
      new URL('https://app.trakt.tv/callback/app/trakt?code=abc&state=xyz'),
      FALLBACK,
    );

    expect(intent).to.equal(
      'intent://app.trakt.tv/callback/app/trakt?code=abc&state=xyz' +
        '#Intent;scheme=https;package=tv.trakt.trakt;' +
        `S.browser_fallback_url=${encodeURIComponent(FALLBACK)};end`,
    );
  });

  it('should return null without a code', () => {
    const intent = buildAppCallbackIntent(
      new URL('https://app.trakt.tv/callback/app/trakt?state=xyz'),
      FALLBACK,
    );

    expect(intent).to.equal(null);
  });
});
