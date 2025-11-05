import { describe, expect, it } from 'vitest';
import type { EpisodeEntry } from '$lib/requests/models/EpisodeEntry.ts';
import type { MovieEntry } from '$lib/requests/models/MovieEntry.ts';
import type { ShowEntry } from '$lib/requests/models/ShowEntry.ts';
import { buildPlexLink } from './buildPlexLink.ts';

describe('buildPlexLink', () => {
  it('should build a correct link for a movie', () => {
    const target = {
      type: 'movie' as const,
      media: {
        plexSlug: 'the-matrix',
      } as MovieEntry,
    };

    const result = buildPlexLink(target);
    expect(result).toBe('https://watch.plex.tv/movie/the-matrix');
  });

  it('should build a correct link for a show', () => {
    const target = {
      type: 'show' as const,
      media: {
        plexSlug: 'breaking-bad',
      } as ShowEntry,
    };

    const result = buildPlexLink(target);
    expect(result).toBe('https://watch.plex.tv/show/breaking-bad');
  });

  it('should build a correct link for an episode', () => {
    const target = {
      type: 'episode' as const,
      media: {
        plexSlug: 'breaking-bad',
      } as ShowEntry,
      episode: {
        season: 1,
        number: 5,
      } as EpisodeEntry,
    };

    const result = buildPlexLink(target);
    expect(result).toBe(
      'https://watch.plex.tv/show/breaking-bad/season/1/episode/5',
    );
  });
});
