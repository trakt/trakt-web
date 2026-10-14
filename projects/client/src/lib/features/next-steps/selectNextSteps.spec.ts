import { describe, expect, it } from 'vitest';
import { NextStepId } from './NextStepId.ts';
import type { NextStepSignals } from './NextStepSignals.ts';
import { selectNextSteps } from './selectNextSteps.ts';

const FRESH: NextStepSignals = {
  watchedCount: 0,
  watchlistCount: 0,
  ratingsCount: 0,
  lovedGenresCount: 0,
  favoriteServicesCount: 0,
  streamingConnectionsCount: 0,
  followingCount: 0,
  listsCount: 0,
  commentsCount: 0,
};

const VETERAN: NextStepSignals = {
  watchedCount: 120,
  watchlistCount: 40,
  ratingsCount: 30,
  lovedGenresCount: 2,
  favoriteServicesCount: 3,
  streamingConnectionsCount: 1,
  followingCount: 5,
  listsCount: 2,
  commentsCount: 4,
};

const ids = (signals: NextStepSignals) =>
  selectNextSteps(signals)?.steps.map((step) => step.id);

describe('util: selectNextSteps', () => {
  it('should show the first three steps to a brand new member', () => {
    expect(selectNextSteps(FRESH)).toEqual({
      steps: [
        { id: NextStepId.WatchHistory, isDone: false },
        { id: NextStepId.Watchlist, isDone: false },
        { id: NextStepId.Rate, isDone: false },
      ],
      completed: 0,
      total: 3,
    });
  });

  it('should keep a completed step ticked on its page', () => {
    const page = selectNextSteps({ ...FRESH, watchedCount: 1 });

    expect(page?.completed).toBe(1);
    expect(page?.steps.at(0)).toEqual({
      id: NextStepId.WatchHistory,
      isDone: true,
    });
  });

  it('should only count the watchlist step once three titles are added', () => {
    expect(selectNextSteps({ ...FRESH, watchlistCount: 2 })?.completed)
      .toBe(0);
    expect(selectNextSteps({ ...FRESH, watchlistCount: 3 })?.completed)
      .toBe(1);
  });

  it('should move to the next page once a page is done', () => {
    expect(ids({
      ...FRESH,
      watchedCount: 1,
      watchlistCount: 3,
      ratingsCount: 1,
    })).toEqual([
      NextStepId.FavoriteGenres,
      NextStepId.FavoriteServices,
      NextStepId.StreamingSync,
    ]);
  });

  it('should surface a later page for members who skipped one step', () => {
    expect(ids({ ...VETERAN, commentsCount: 0 })).toEqual([
      NextStepId.Follow,
      NextStepId.CreateList,
      NextStepId.Comment,
    ]);
  });

  it('should return null once every step is done', () => {
    expect(selectNextSteps(VETERAN)).toBeNull();
  });

  describe('when steps are skipped', () => {
    it('should pull the next step into the skipped slot', () => {
      expect(
        selectNextSteps(FRESH, [NextStepId.Watchlist])?.steps.map((s) => s.id),
      ).toEqual([
        NextStepId.WatchHistory,
        NextStepId.Rate,
        NextStepId.FavoriteGenres,
      ]);
    });

    it('should not count a skip as progress', () => {
      const page = selectNextSteps(
        { ...FRESH, lovedGenresCount: 1, favoriteServicesCount: 1 },
        [
          NextStepId.WatchHistory,
          NextStepId.Watchlist,
          NextStepId.Rate,
          NextStepId.StreamingSync,
        ],
      );

      expect(page).toEqual({
        steps: [
          { id: NextStepId.FavoriteGenres, isDone: true },
          { id: NextStepId.FavoriteServices, isDone: true },
          { id: NextStepId.Follow, isDone: false },
        ],
        completed: 2,
        total: 3,
      });
    });

    it('should return null once every remaining step is skipped', () => {
      expect(
        selectNextSteps({ ...VETERAN, commentsCount: 0 }, [NextStepId.Comment]),
      ).toBeNull();
    });
  });
});
