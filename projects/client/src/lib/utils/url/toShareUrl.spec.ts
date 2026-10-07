import { describe, expect, it } from 'vitest';
import { toShareUrl } from './toShareUrl.ts';

describe('toShareUrl', () => {
  it('will stamp the share code on an absolute url', () => {
    expect(
      toShareUrl({
        url: 'https://app.trakt.tv/movies/the-matrix-1999',
        shareCode: 'Xk3mPq2Bf9aQ',
      }),
    ).toBe('https://app.trakt.tv/movies/the-matrix-1999?share=Xk3mPq2Bf9aQ');
  });

  it('will replace an existing share param', () => {
    expect(
      toShareUrl({
        url: 'https://app.trakt.tv/movies/the-matrix-1999?share=true&tab=cast',
        shareCode: 'Xk3mPq2Bf9aQ',
      }),
    ).toBe(
      'https://app.trakt.tv/movies/the-matrix-1999?share=Xk3mPq2Bf9aQ&tab=cast',
    );
  });

  it('will fall back to share=true without a share code', () => {
    expect(
      toShareUrl({ url: 'https://app.trakt.tv/shows/silo', shareCode: null }),
    ).toBe('https://app.trakt.tv/shows/silo?share=true');
  });

  it('will append the share code to a relative url', () => {
    expect(toShareUrl({ url: '/users/sean', shareCode: 'Xk3mPq2Bf9aQ' }))
      .toBe('/users/sean?share=Xk3mPq2Bf9aQ');
    expect(toShareUrl({ url: '/users/sean?tab=lists', shareCode: null }))
      .toBe('/users/sean?tab=lists&share=true');
  });

  it('will leave an empty url empty', () => {
    expect(toShareUrl({ url: '', shareCode: 'Xk3mPq2Bf9aQ' })).toBe('');
  });
});
