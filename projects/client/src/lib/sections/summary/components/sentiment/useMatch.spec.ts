import { runQuery } from '$test/beds/query/runQuery.ts';
import { BehaviorSubject, of } from 'rxjs';
import { describe, expect, it, vi } from 'vitest';
import { useMatch } from './useMatch.ts';

const user = vi.hoisted(() => ({ current: undefined as unknown }));

vi.mock('$lib/features/auth/stores/useAuth.ts', () => ({
  useAuth: () => ({ isAuthorized: of(true) }),
}));
vi.mock('$lib/features/auth/stores/useUser.ts', () => ({
  useUser: () => ({ user: new BehaviorSubject(user.current) }),
}));
vi.mock('$lib/features/query/useQuery.ts', () => ({
  useQuery: () => of({ data: undefined }),
}));

describe('useMatch', () => {
  const target = of({ type: 'movie' as const, id: 1 });

  it('should not be available while the user has not loaded yet', async () => {
    user.current = undefined;

    const isAvailable = await runQuery({
      factory: () => useMatch(target).isAvailable,
      waitFor: () => true,
    });

    expect(isAvailable).toBe(false);
  });

  it('should be available for a vip user', async () => {
    user.current = { isVip: true, isDirector: false };

    const isAvailable = await runQuery({
      factory: () => useMatch(target).isAvailable,
      waitFor: () => true,
    });

    expect(isAvailable).toBe(true);
  });
});
