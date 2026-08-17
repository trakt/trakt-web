import type { ShareType } from '$lib/features/share/models/ShareType.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';
import { describe, expect, it } from 'vitest';
import { buildImagePath } from './buildImagePath.ts';

describe('util: buildImagePath', () => {
  it('should namespace share images under their own root', () => {
    const path = buildImagePath({
      shareType: 'open-graph',
      type: 'show',
      slug: 'reacher',
    });

    expect(path).toBe('images/share/og/show/reacher/image.png');
  });

  describe('share types', () => {
    it.each<[ShareType, string]>([
      ['open-graph', 'og'],
      ['feed', 'feed'],
      ['story', 'story'],
    ])('should store the %s variant under %s', (shareType, folder) => {
      const path = buildImagePath({ shareType, type: 'show', slug: 'reacher' });

      expect(path).toBe(`images/share/${folder}/show/reacher/image.png`);
    });
  });

  describe('media types', () => {
    it.each<MediaType>(['movie', 'show'])(
      'should keep %s paths separate',
      (type) => {
        const path = buildImagePath({
          shareType: 'feed',
          type,
          slug: 'reacher',
        });

        expect(path).toBe(`images/share/feed/${type}/reacher/image.png`);
      },
    );
  });
});
