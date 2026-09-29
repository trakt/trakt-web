import { useInfiniteQuery } from '$lib/features/query/useQuery.ts';
import type { Paginatable } from '$lib/requests/models/Paginatable.ts';
import { followingActivityQuery } from '$lib/requests/queries/users/followingActivityQuery.ts';
import { combineLatest, map } from 'rxjs';
import { getDayRange } from './_internal/getDayRange.ts';
import { toActivityWindow } from './_internal/toActivityWindow.ts';

type TodayDayCountsParams = {
  days: ReadonlyArray<Readonly<{ key: string }>>;
  now: Date;
};

function toCount(page: Paginatable<unknown> | undefined): number | null {
  if (!page) return null;
  if (page.entries.length === 0) return 0;

  return page.page.type === 'paginated' ? page.page.total : page.entries.length;
}

export function useTodayDayCounts({ days, now }: TodayDayCountsParams) {
  const counts = days.map(({ key }) => {
    const range = getDayRange({ dayKey: key, now });

    return useInfiniteQuery(
      followingActivityQuery({ limit: 1, ...toActivityWindow(range) }),
    )
      .pipe(map(($query) => [key, toCount($query.data?.pages.at(0))] as const));
  });

  return combineLatest(counts).pipe(
    map((entries): Record<string, number | null> =>
      Object.fromEntries(entries)
    ),
  );
}
