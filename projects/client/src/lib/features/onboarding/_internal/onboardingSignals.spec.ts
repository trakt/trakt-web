import { firstValueFrom, lastValueFrom, of } from 'rxjs';
import { describe, expect, it, vi } from 'vitest';
import { onboardingSignals } from './onboardingSignals.ts';

const NO_USER = {
  watchlist: of(undefined),
  history: of(undefined),
  ratings: of(undefined),
  network: of(undefined),
};

const user = vi.hoisted(() => ({ streams: {} as Record<string, unknown> }));

vi.mock('$lib/features/auth/stores/useUser.ts', () => ({
  useUser: () => user.streams,
}));

function withUser(streams: Partial<typeof NO_USER> | object) {
  user.streams = { ...NO_USER, ...streams };
}

describe('onboardingSignals', () => {
  it('should count plays, not titles, for history', async () => {
    withUser({
      history: of({
        movies: new Map([[1, { plays: 2 }]]),
        shows: new Map([[7, { episodes: [{ plays: 1 }, { plays: 3 }] }]]),
      }),
    });

    expect(await firstValueFrom(onboardingSignals.plays())).toBe(6);
  });

  it('should keep the last settled history while it reloads', async () => {
    withUser({
      history: of(
        { movies: new Map([[1, { plays: 2 }]]), shows: new Map() },
        undefined,
      ),
    });

    expect(await lastValueFrom(onboardingSignals.plays())).toBe(2);
  });

  it('should count ratings across every media type', async () => {
    withUser({
      ratings: of({
        movies: new Map([[1, { rating: 8 }]]),
        shows: new Map([[2, { rating: 9 }]]),
        seasons: new Map(),
        episodes: new Map([[3, { rating: 7 }]]),
      }),
    });

    expect(await firstValueFrom(onboardingSignals.ratings())).toBe(3);
  });

  it('should count nothing for a missing account', async () => {
    withUser({});

    const counts = await Promise.all(
      Object.values(onboardingSignals).map((source) =>
        firstValueFrom(source()),
      ),
    );

    expect(counts).toEqual([0, 0, 0, 0]);
  });
});
