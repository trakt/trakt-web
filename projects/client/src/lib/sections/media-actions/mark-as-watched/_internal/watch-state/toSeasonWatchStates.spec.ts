import type { WatchedShow } from '$lib/features/auth/queries/currentUserWatchedShowsQuery.ts';
import { ShowSiloSeasonsMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloSeasonsMappedMock.ts';
import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { describe, expect, it } from 'vitest';
import { toSeasonWatchStates } from './toSeasonWatchStates.ts';

const toWatchedShow = (
  episodes: ReadonlyArray<{ season: number; episodeId: number }>,
): WatchedShow => ({
  id: 1,
  watchedAt: new Date(0),
  watchedDates: [],
  playsPerSeason: new Map(),
  episodes: episodes.map((episode) => ({
    ...episode,
    watchedAt: new Date(0),
    plays: 1,
  })),
});

describe('util: toSeasonWatchStates', () => {
  it('should report zero progress when nothing is watched', () => {
    const states = toSeasonWatchStates({
      seasons: ShowSiloSeasonsMappedMock,
      watchedShow: null,
    });

    expect(states.map((state) => state.watched)).to.deep.equal([0, 0, 0]);
  });

  it('should count watched episodes per season', () => {
    const states = toSeasonWatchStates({
      seasons: ShowSiloSeasonsMappedMock,
      watchedShow: toWatchedShow([
        { season: 1, episodeId: 11 },
        { season: 1, episodeId: 12 },
        { season: 2, episodeId: 21 },
      ]),
    });

    expect(states.map((state) => state.watched)).to.deep.equal([2, 1, 0]);
    expect(states.map((state) => state.progress)).to.deep.equal([20, 10, 0]);
    expect([...(states.at(0)?.watchedEpisodeIds ?? [])]).to.deep.equal([
      11, 12,
    ]);
  });

  it('should mark a season complete once every aired episode is watched', () => {
    const states = toSeasonWatchStates({
      seasons: ShowSiloSeasonsMappedMock,
      watchedShow: toWatchedShow(
        Array.from({ length: 10 }, (_, index) => ({
          season: 1,
          episodeId: 100 + index,
        })),
      ),
    });

    expect(states.map((state) => state.isComplete)).to.deep.equal([
      true,
      false,
      false,
    ]);
  });

  it('should never count more watched than aired episodes', () => {
    const states = toSeasonWatchStates({
      seasons: ShowSiloSeasonsMappedMock,
      watchedShow: toWatchedShow([{ season: 3, episodeId: 31 }]),
    });

    expect(states.at(2)?.watched).to.equal(0);
  });

  it('should list specials before the regular seasons', () => {
    const specials = {
      ...assertDefined(ShowSiloSeasonsMappedMock.at(0)),
      number: 0,
    };
    const states = toSeasonWatchStates({
      seasons: [...ShowSiloSeasonsMappedMock, specials],
      watchedShow: null,
    });

    expect(states.map((state) => state.number)).to.deep.equal([0, 1, 2, 3]);
  });
});
