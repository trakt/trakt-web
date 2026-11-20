import { EpisodeSiloMappedMock } from '$mocks/data/summary/episodes/silo/mapped/EpisodeSiloMappedMock.ts';
import { MovieHereticMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticMappedMock.ts';
import { ShowSiloMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloMappedMock.ts';
import { UserWatchingMappedMock } from '$mocks/data/users/mapped/UserWatchingMappedMock.ts';
import { describe, expect, it } from 'vitest';
import { toWatchingTitles } from './toWatchingTitles.ts';

describe('util: toWatchingTitles', () => {
  it('should use the movie title and link to the movie', () => {
    const titles = toWatchingTitles(UserWatchingMappedMock);

    expect(titles.title).toBe(UserWatchingMappedMock.media.title);
    expect(titles.subtitle).toBeNull();
    expect(titles.href).toContain(`/movies/${MovieHereticMappedMock.slug}`);
  });

  it('should lead with the show and put the episode underneath', () => {
    const titles = toWatchingTitles({
      ...UserWatchingMappedMock,
      type: 'episode',
      show: ShowSiloMappedMock,
      media: EpisodeSiloMappedMock,
    });

    expect(titles.title).toBe(ShowSiloMappedMock.title);
    expect(titles.subtitle).toContain(EpisodeSiloMappedMock.title);
    expect(titles.href).toContain(`/shows/${ShowSiloMappedMock.slug}`);
  });
});
