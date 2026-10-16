import { describe, expect, it } from 'vitest';
import { toSmartListTemplateUrl } from './toSmartListTemplateUrl.ts';

describe('util: toSmartListTemplateUrl', () => {
  it('should carry the name, source, media type and filters', () => {
    const url = new URL(
      toSmartListTemplateUrl({
        name: "Critics' Darlings",
        template: {
          source: 'discover',
          mediaType: 'movies',
          filters: { metascores: [80], votes: [1000], genres: ['drama'] },
        },
      }),
      'https://trakt.tv',
    );

    expect(url.pathname).toBe('/lists/smart/create');
    expect(Object.fromEntries(url.searchParams)).toEqual({
      name: "Critics' Darlings",
      source: 'discover',
      mode: 'movie',
      metascores: '80-100',
      votes: '1000-999999999',
      genres: 'drama',
    });
  });

  it('should close an open range so the sliders show a full range', () => {
    const url = new URL(
      toSmartListTemplateUrl({
        name: 'x',
        template: {
          source: 'discover',
          mediaType: 'movies',
          filters: { ratings: [78], votes: [1000], runtimes: [0, 95] },
        },
      }),
      'https://trakt.tv',
    );

    expect(Object.fromEntries(url.searchParams)).toMatchObject({
      ratings: '78-100',
      votes: '1000-999999999',
      runtimes: '0-95',
    });
  });

  it('should map the media type to the discover mode', () => {
    const mode = (mediaType: 'movies' | 'shows' | 'media') =>
      new URL(
        toSmartListTemplateUrl({
          name: 'x',
          template: { source: 'trending', mediaType, filters: {} },
        }),
        'https://trakt.tv',
      ).searchParams.get('mode');

    expect([mode('movies'), mode('shows'), mode('media')]).toEqual([
      'movie',
      'show',
      'media',
    ]);
  });
});
