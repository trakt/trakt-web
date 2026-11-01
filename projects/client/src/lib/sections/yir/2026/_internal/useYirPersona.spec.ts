import { server } from '$mocks/server.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { http, HttpResponse } from 'msw';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import { describe, expect, it } from 'vitest';
import { useYirPersona } from './useYirPersona.ts';

const respondWith = (payload: Record<string, string>, status: number) =>
  server.use(
    http.get('http://localhost/users/:slug/yir/:year/persona', () =>
      HttpResponse.json(payload, { status }),
    ),
  );

const run = async (slug: string) => {
  const { isOpen } = await runQuery({
    factory: () => {
      const { isYearOpen, isLoading } = useYirPersona(
        new BehaviorSubject({ slug, year: 2026 }),
      );

      return combineLatest([isYearOpen, isLoading]).pipe(
        map(([isOpen, loading]) => ({ isOpen, loading })),
      );
    },
    waitFor: ({ loading }) => !loading,
  });

  return isOpen;
};

describe('useYirPersona', () => {
  it('should report a year that is not open yet as closed', async () => {
    respondWith({ error: 'year_not_open' }, 403);

    expect(await run('closed')).toBe(false);
  });

  it('should report the year as open when VIP is required', async () => {
    respondWith({ error: 'vip_required' }, 403);

    expect(await run('free')).toBe(true);
  });

  it('should report the year as open when the persona is not found', async () => {
    respondWith({ error: 'not_found' }, 404);

    expect(await run('missing')).toBe(true);
  });
});
