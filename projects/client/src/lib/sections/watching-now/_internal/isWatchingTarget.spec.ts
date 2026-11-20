import type { NowPlayingItem } from '$lib/requests/models/NowPlayingItem.ts';
import { EpisodeSiloMappedMock } from '$mocks/data/summary/episodes/silo/mapped/EpisodeSiloMappedMock.ts';
import { MovieHereticMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticMappedMock.ts';
import { ShowSiloMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloMappedMock.ts';
import { describe, expect, it } from 'vitest';
import { isWatchingTarget } from './isWatchingTarget.ts';

const window = {
  startedAt: new Date('2026-11-06T19:00:00.000Z'),
  expiresAt: new Date('2026-11-06T20:00:00.000Z'),
  action: 'scrobble',
} as const;

const movie: NowPlayingItem = {
  ...window,
  type: 'movie',
  media: MovieHereticMappedMock,
};

const episode: NowPlayingItem = {
  ...window,
  type: 'episode',
  media: EpisodeSiloMappedMock,
  show: ShowSiloMappedMock,
};

describe('util: isWatchingTarget', () => {
  it('should match a movie by its slug', () => {
    expect(
      isWatchingTarget({
        nowPlaying: movie,
        target: { type: 'movie', slug: MovieHereticMappedMock.slug },
      }),
    ).toBe(true);
    expect(
      isWatchingTarget({
        nowPlaying: movie,
        target: { type: 'movie', slug: 'another-movie' },
      }),
    ).toBe(false);
  });

  it('should match any episode of a show', () => {
    expect(
      isWatchingTarget({
        nowPlaying: episode,
        target: { type: 'show', slug: ShowSiloMappedMock.slug },
      }),
    ).toBe(true);
  });

  it('should match only the same season and episode', () => {
    const target = {
      type: 'episode',
      slug: ShowSiloMappedMock.slug,
      season: EpisodeSiloMappedMock.season,
      episode: EpisodeSiloMappedMock.number,
    } as const;

    expect(isWatchingTarget({ nowPlaying: episode, target })).toBe(true);
    expect(
      isWatchingTarget({
        nowPlaying: episode,
        target: { ...target, episode: target.episode + 1 },
      }),
    ).toBe(false);
  });

  it('should not mix movies and shows', () => {
    expect(
      isWatchingTarget({
        nowPlaying: movie,
        target: { type: 'show', slug: MovieHereticMappedMock.slug },
      }),
    ).toBe(false);
  });
});
