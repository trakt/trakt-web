import { useQueryClient } from '$lib/features/query/_internal/queryClientContext.ts';
import type { NowPlayingItem } from '$lib/requests/models/NowPlayingItem.ts';
import { time } from '$lib/utils/timing/time.ts';
import { UserWatchingMappedMock } from '$mocks/data/users/mapped/UserWatchingMappedMock.ts';
import { renderStore } from '$test/beds/store/renderStore.ts';
import { BehaviorSubject } from 'rxjs';
import { describe, expect, it, vi } from 'vitest';
import { useNowPlaying } from '$lib/features/toast/useNowPlaying.ts';
import { useCheckInEnd } from './useCheckInEnd.ts';

const renderCheckInEnd = () =>
  renderStore(() => {
    const client = useQueryClient();

    return {
      invalidateQueries: vi
        .spyOn(client, 'invalidateQueries')
        .mockResolvedValue(undefined),
      ...useCheckInEnd(),
    };
  });

const endCheckIn = async (expiresAt: Date) => {
  const { refreshHistoryOnEnd, invalidateQueries } = await renderCheckInEnd();
  const nowPlaying = new BehaviorSubject<NowPlayingItem | null>(null);
  const subscription = refreshHistoryOnEnd(nowPlaying);

  nowPlaying.next({ ...UserWatchingMappedMock, expiresAt });
  nowPlaying.next(null);
  subscription.unsubscribe();

  return invalidateQueries;
};

describe('store: useCheckInEnd', () => {
  it('should refresh the history once a check-in runs out', async () => {
    const invalidateQueries = await endCheckIn(
      new Date(Date.now() - time.seconds(1)),
    );

    expect(invalidateQueries).toHaveBeenCalledTimes(1);
  });

  it('should refresh the history when a scrobble stops early', async () => {
    const invalidateQueries = await endCheckIn(
      new Date(Date.now() + time.minutes(30)),
    );

    expect(invalidateQueries).toHaveBeenCalledTimes(1);
  });

  it('should not refresh the history while nothing is playing', async () => {
    const { refreshHistoryOnEnd, invalidateQueries } = await renderCheckInEnd();
    const nowPlaying = new BehaviorSubject<NowPlayingItem | null>(null);
    const subscription = refreshHistoryOnEnd(nowPlaying);

    nowPlaying.next(null);
    subscription.unsubscribe();

    expect(invalidateQueries).not.toHaveBeenCalled();
  });

  it('should refresh the history when an item arrives already expired', async () => {
    const { nowPlaying, refreshHistoryOnEnd, invalidateQueries } =
      await renderStore(() => ({
        ...useNowPlaying(),
        ...useCheckInEnd(),
        invalidateQueries: vi
          .spyOn(useQueryClient(), 'invalidateQueries')
          .mockResolvedValue(undefined),
      }));
    const subscription = refreshHistoryOnEnd(nowPlaying);

    nowPlaying.next({
      ...UserWatchingMappedMock,
      expiresAt: new Date(Date.now() - time.seconds(1)),
    });
    await Promise.resolve();
    subscription.unsubscribe();

    expect(nowPlaying.value).toBeNull();
    expect(invalidateQueries).toHaveBeenCalledTimes(1);
  });
});
