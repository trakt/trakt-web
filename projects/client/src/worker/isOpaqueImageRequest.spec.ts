import { describe, expect, it } from 'vitest';

import { isOpaqueImageRequest } from './isOpaqueImageRequest.ts';

const IMAGE_URL = 'https://media.trakt.tv/images/posters/1.webp';

describe('util: isOpaqueImageRequest', () => {
  it('should handle a plain image request', () => {
    expect(isOpaqueImageRequest({ url: IMAGE_URL, mode: 'no-cors' })).toBe(
      true,
    );
  });

  it('should leave a cors image request to the network', () => {
    expect(isOpaqueImageRequest({ url: IMAGE_URL, mode: 'cors' })).toBe(false);
  });

  it('should ignore other hosts', () => {
    expect(
      isOpaqueImageRequest({
        url: 'https://app.trakt.tv/logo.png',
        mode: 'no-cors',
      }),
    ).toBe(false);
  });
});
