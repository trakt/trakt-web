import { useInfiniteQuery } from '$lib/features/query/useQuery.ts';
import type { Paginatable } from '$lib/requests/models/Paginatable.ts';
import { followingActivityQuery } from '$lib/requests/queries/users/followingActivityQuery.ts';
import { combineLatest, map } from 'rxjs';
import { toCountRanges } from './_internal/toCountRanges.ts';
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

function sumCounts(counts: ReadonlyArray<number | null>): number | null {
  if (counts.some((count) => count == null)) return null;
  return counts.reduce<number>((total, count) => total + (count ?? 0), 0);
}

export function useTodayDayCounts({ days, now }: TodayDayCountsParams) {
  const counts = days.map(({ key }) => {
    const ranges = toCountRanges({ dayKey: key, now });
    const rangeCounts = ranges.map((range) =>
      useInfiniteQuery(
        followingActivityQuery({ limit: 1, ...toActivityWindow(range) }),
      ).pipe(map(($query) => toCount($query.data?.pages.at(0))))
    );

    return combineLatest(rangeCounts).pipe(
      map(($counts) => [key, sumCounts($counts)] as const),
    );
  });

  return combineLatest(counts).pipe(
    map((entries): Record<string, number | null> =>
      Object.fromEntries(entries)
    ),
  );
}
