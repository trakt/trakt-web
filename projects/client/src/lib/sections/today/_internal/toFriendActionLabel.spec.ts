import { EpisodeSiloMappedMock } from '$mocks/data/summary/episodes/silo/mapped/EpisodeSiloMappedMock.ts';
import { buildFriendAction } from '$test/beds/today/buildFriendAction.ts';
import { describe, expect, it } from 'vitest';
import { toFriendActionLabel } from './toFriendActionLabel.ts';

const watch = buildFriendAction({
  target: 'episode',
  activityAt: new Date(2026, 8, 28, 9, 30),
  episode: EpisodeSiloMappedMock,
  episodeCount: 1,
});

describe('util: toFriendActionLabel', () => {
  it('should describe the action without the time', () => {
    expect(toFriendActionLabel(watch)).toBe(
      `Watched S${EpisodeSiloMappedMock.season} • E${EpisodeSiloMappedMock.number}`,
    );
  });

  it('should count several episodes', () => {
    expect(toFriendActionLabel({ ...watch, episodeCount: 3 })).toBe(
      'Watched 3 episodes',
    );
  });

  it('should fall back to the verb for a movie', () => {
    expect(
      toFriendActionLabel({
        ...watch,
        target: 'movie',
        episode: null,
        episodeCount: 0,
      }),
    ).toBe('Watched');
  });
});
