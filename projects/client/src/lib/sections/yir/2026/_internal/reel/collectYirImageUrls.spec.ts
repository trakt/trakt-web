import { MEDIA_POSTER_PLACEHOLDER } from '$lib/utils/assets.ts';
import { YirDetailMappedMock } from '$mocks/data/users/mapped/YirDetailMappedMock.ts';
import { describe, expect, it } from 'vitest';
import { collectYirImageUrls } from './collectYirImageUrls.ts';

describe('util: collectYirImageUrls', () => {
  it('should return nothing without detail', () => {
    expect(collectYirImageUrls(null)).toEqual([]);
  });

  it('should start with the first play cover', () => {
    expect(collectYirImageUrls(YirDetailMappedMock).at(0)).toBe(
      YirDetailMappedMock.firstWatched?.entry.cover.url.medium,
    );
  });

  it('should not repeat urls', () => {
    const urls = collectYirImageUrls(YirDetailMappedMock);

    expect(new Set(urls).size).toBe(urls.length);
  });

  it('should skip empty and placeholder urls', () => {
    const [first] = YirDetailMappedMock.mostWatched.shows;
    const detail = {
      ...YirDetailMappedMock,
      mostWatched: {
        ...YirDetailMappedMock.mostWatched,
        shows: first
          ? [
            first,
            {
              ...first,
              entry: {
                ...first.entry,
                poster: {
                  url: {
                    medium: MEDIA_POSTER_PLACEHOLDER,
                    thumb: MEDIA_POSTER_PLACEHOLDER,
                  },
                },
              },
            },
          ]
          : [],
      },
    };

    const urls = collectYirImageUrls(detail);

    expect(urls).not.toContain(MEDIA_POSTER_PLACEHOLDER);
    expect(urls).not.toContain('');
  });
});
