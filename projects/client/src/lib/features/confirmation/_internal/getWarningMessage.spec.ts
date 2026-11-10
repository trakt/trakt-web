import { MovieHereticMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticMappedMock.ts';
import { EpisodeSiloMappedMock } from '$mocks/data/summary/episodes/silo/mapped/EpisodeSiloMappedMock.ts';
import { ShowSiloMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloMappedMock.ts';
import { describe, expect, it } from 'vitest';
import { getWarningMessage } from './getWarningMessage.ts';

const episode = (number: number, season = 1) => ({
  ...EpisodeSiloMappedMock,
  season,
  number,
});

const show = { id: ShowSiloMappedMock.id, title: ShowSiloMappedMock.title };

describe('util: getWarningMessage', () => {
  it('should not warn when marking a movie', () => {
    expect(
      getWarningMessage('Heretic', {
        type: 'movie',
        media: MovieHereticMappedMock,
      }),
    ).toBeNull();
  });

  describe('for episodes', () => {
    it('should not warn for a single episode', () => {
      expect(
        getWarningMessage('Silo', {
          type: 'episode',
          media: [EpisodeSiloMappedMock],
          show,
        }),
      ).toBeNull();
    });

    it('should warn with the count when marking several episodes', () => {
      const message = getWarningMessage('Silo', {
        type: 'episode',
        media: [episode(1), episode(2), episode(3)],
        show,
      });

      expect(message).toBe(
        'Are you sure you want to mark 3 episodes as watched?',
      );
    });
  });

  describe('for shows', () => {
    it('should warn about the whole show without a selection', () => {
      const message = getWarningMessage('Silo', {
        type: 'show',
        media: ShowSiloMappedMock,
      });

      expect(message).toContain('Silo');
    });

    it('should name the last season and episode when marking until an episode', () => {
      const message = getWarningMessage('Silo', {
        type: 'show',
        media: {
          ...ShowSiloMappedMock,
          seasons: [
            { number: 1, episodes: [{ number: 1 }, { number: 2 }] },
            { number: 2, episodes: [{ number: 1 }, { number: 4 }] },
          ],
        },
      });

      expect(message).toContain('2x4');
    });

    it('should not warn when the selection is a single episode', () => {
      const message = getWarningMessage('Silo', {
        type: 'show',
        media: {
          ...ShowSiloMappedMock,
          seasons: [{ number: 1, episodes: [{ number: 1 }] }],
        },
      });

      expect(message).toBeNull();
    });

    it('should mention the episode count when tracking a show', () => {
      const message = getWarningMessage('Silo', {
        type: 'show',
        media: {
          ...ShowSiloMappedMock,
          episode: { count: 12000 },
        },
      });

      expect(message).toBe(
        'Are you sure you want to mark "Silo" as watched? This will mark 12K episodes as watched.',
      );
    });
  });
});
