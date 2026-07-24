import type { WatchedShow } from '$lib/features/auth/queries/currentUserWatchedShowsQuery.ts';
import { describe, expect, it } from 'vitest';
import { getShowWatchState } from './getShowWatchState.ts';

type EpisodeInput = { season: number; episodeId: number; plays?: number };

function createWatchedShow(episodes: ReadonlyArray<EpisodeInput>): WatchedShow {
  const mappedEpisodes = episodes.map((e) => ({
    season: e.season,
    episodeId: e.episodeId,
    watchedAt: new Date(0),
    plays: e.plays ?? 1,
  }));

  const playsPerSeason = mappedEpisodes.reduce(
    (acc, { season }) => acc.set(season, (acc.get(season) ?? 0) + 1),
    new Map<number, number>(),
  );

  return {
    id: 1,
    watchedAt: new Date(0),
    watchedDates: mappedEpisodes.map((e) => e.watchedAt),
    episodes: mappedEpisodes,
    playsPerSeason,
  };
}

describe('util: getShowWatchState', () => {
  it('should be empty when there is no watched show', () => {
    expect(getShowWatchState({ watchedShow: null, episodeCount: 10 })).toEqual({
      watchedEpisodeCount: 0,
      isWatched: false,
      isStarted: false,
      minPlays: 0,
    });
  });

  it('should mark a show watched when every regular episode is seen', () => {
    const watchedShow = createWatchedShow([
      { season: 1, episodeId: 1 },
      { season: 1, episodeId: 2 },
    ]);

    const state = getShowWatchState({ watchedShow, episodeCount: 2 });

    expect(state.isWatched).toBe(true);
    expect(state.isStarted).toBe(true);
    expect(state.watchedEpisodeCount).toBe(2);
  });

  it('should mark a partially seen show as started, not watched', () => {
    const watchedShow = createWatchedShow([{ season: 1, episodeId: 1 }]);

    const state = getShowWatchState({ watchedShow, episodeCount: 10 });

    expect(state.isWatched).toBe(false);
    expect(state.isStarted).toBe(true);
  });

  it('should never mark a show watched when episode count is missing', () => {
    const watchedShow = createWatchedShow([
      { season: 1, episodeId: 1 },
      { season: 1, episodeId: 2 },
    ]);

    expect(getShowWatchState({ watchedShow, episodeCount: null }).isWatched)
      .toBe(false);
    expect(getShowWatchState({ watchedShow, episodeCount: 0 }).isWatched)
      .toBe(false);
  });

  it('should ignore specials (season 0) for completion', () => {
    const watchedShow = createWatchedShow([
      { season: 0, episodeId: 99 },
      { season: 1, episodeId: 1 },
    ]);

    const state = getShowWatchState({ watchedShow, episodeCount: 2 });

    expect(state.watchedEpisodeCount).toBe(1);
    expect(state.isWatched).toBe(false);
  });

  it('should report the minimum play count across regular episodes', () => {
    const watchedShow = createWatchedShow([
      { season: 1, episodeId: 1, plays: 3 },
      { season: 1, episodeId: 2, plays: 1 },
    ]);

    expect(getShowWatchState({ watchedShow, episodeCount: 2 }).minPlays).toBe(
      1,
    );
  });
});
