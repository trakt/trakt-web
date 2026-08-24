import {
  currentUserRatingsQuery,
  type UserRatings,
} from '$lib/features/auth/queries/currentUserRatingsQuery.ts';
import { useQueryClient } from '$lib/features/query/_internal/queryClientContext.ts';
import { time } from '$lib/utils/timing/time.ts';
import { renderStore } from '$test/beds/store/renderStore.ts';
import { describe, expect, it, vi } from 'vitest';
import { useFreshRatings } from './useFreshRatings.ts';

const watchedAt = new Date('2026-08-24T12:00:00.000Z');
const staleSnapshot = new Date(watchedAt.getTime() - time.hours(1));

const emptyRatings: UserRatings = {
  movies: new Map(),
  shows: new Map(),
  seasons: new Map(),
  episodes: new Map(),
};

const renderFreshRatings = (snapshotUpdatedAt?: Date) =>
  renderStore(() => {
    const client = useQueryClient();
    const { queryKey } = currentUserRatingsQuery();

    if (snapshotUpdatedAt) {
      client.setQueryData<UserRatings>(queryKey, emptyRatings, {
        updatedAt: snapshotUpdatedAt.getTime(),
      });
    }

    return {
      queryKey,
      invalidateQueries: vi
        .spyOn(client, 'invalidateQueries')
        .mockResolvedValue(undefined),
      ...useFreshRatings(),
    };
  });

describe('store: useFreshRatings', () => {
  it('should not vouch for a watch when no snapshot exists', async () => {
    const { hasCheckedRatingsSince } = await renderFreshRatings();

    expect(hasCheckedRatingsSince(watchedAt)).toBe(false);
  });

  it('should vouch for a watch older than the snapshot', async () => {
    const { hasCheckedRatingsSince, invalidateQueries } =
      await renderFreshRatings(
        new Date(watchedAt.getTime() + time.minutes(1)),
      );

    expect(hasCheckedRatingsSince(watchedAt)).toBe(true);
    expect(invalidateQueries).not.toHaveBeenCalled();
  });

  it('should vouch for a watch as old as the snapshot', async () => {
    const { hasCheckedRatingsSince } = await renderFreshRatings(watchedAt);

    expect(hasCheckedRatingsSince(watchedAt)).toBe(true);
  });

  it('should refresh the snapshot instead of vouching for a newer watch', async () => {
    const { hasCheckedRatingsSince, invalidateQueries, queryKey } =
      await renderFreshRatings(staleSnapshot);

    expect(hasCheckedRatingsSince(watchedAt)).toBe(false);
    expect(invalidateQueries).toHaveBeenCalledWith({ queryKey });
  });

  it('should refresh the snapshot once per watch', async () => {
    const { hasCheckedRatingsSince, invalidateQueries } =
      await renderFreshRatings(
        staleSnapshot,
      );

    hasCheckedRatingsSince(watchedAt);
    hasCheckedRatingsSince(watchedAt);

    expect(invalidateQueries).toHaveBeenCalledTimes(1);
  });

  it('should settle for the snapshot once its refresh has run', async () => {
    const { hasCheckedRatingsSince } = await renderFreshRatings(staleSnapshot);

    expect(hasCheckedRatingsSince(watchedAt)).toBe(false);
    expect(hasCheckedRatingsSince(watchedAt)).toBe(true);
  });

  it('should refresh again for a watch newer than the last refresh', async () => {
    const { hasCheckedRatingsSince, invalidateQueries } =
      await renderFreshRatings(
        staleSnapshot,
      );

    hasCheckedRatingsSince(watchedAt);
    hasCheckedRatingsSince(new Date(watchedAt.getTime() + time.minutes(1)));

    expect(invalidateQueries).toHaveBeenCalledTimes(2);
  });
});
