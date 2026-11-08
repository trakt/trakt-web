import { useQueryClient } from '$lib/features/query/_internal/queryClientContext.ts';
import { useQuery } from '$lib/features/query/useQuery.ts';
import type { RegisteredMemberCount } from '$lib/requests/models/RegisteredMemberCount.ts';
import { registeredMemberCountQuery } from '$lib/requests/queries/stats/registeredMemberCountQuery.ts';
import { toNextMemberCount } from './toNextMemberCount.ts';

/**
 * Live registered-account total for the about page. Seeded from the query
 * cache, so a page that prefetched renders the real total on the server and
 * on hydration. `null` while there is nothing to show yet. Never rewinds: a
 * lagging server response leaves the highest total seen so far in place.
 */
export function useRegisteredMemberCount() {
  const query = useQuery(registeredMemberCountQuery());

  const cached = useQueryClient().getQueryState<RegisteredMemberCount | null>(
    registeredMemberCountQuery().queryKey,
  );

  // Outside `$state` so the subscription only writes state and never reads it.
  let highest = toNextMemberCount({
    current: null,
    data: cached?.data,
    status: cached?.status ?? 'pending',
  });
  let total = $state(highest);

  $effect(() => {
    const subscription = query.subscribe(({ data, status }) => {
      highest = toNextMemberCount({ current: highest, data, status });
      total = highest;
    });

    return () => subscription.unsubscribe();
  });

  return {
    get value() {
      return total;
    },
  };
}
