import { useQuery } from '$lib/features/query/useQuery.ts';
import { registeredMemberCountQuery } from '$lib/requests/queries/stats/registeredMemberCountQuery.ts';

// First-paint value, and the fallback when the endpoint is down: never a zero,
// a spinner, or a width that reflows. Bump on milestones.
const REGISTERED_MEMBER_FLOOR = 17_000_000;

/**
 * Live registered-account total for the about page. Never rewinds: a lagging
 * server response leaves the highest total seen so far in place.
 */
export function useRegisteredMemberCount() {
  const query = useQuery(registeredMemberCountQuery());

  // Outside `$state` so the subscription only writes state and never reads it.
  let highest = REGISTERED_MEMBER_FLOOR;
  let total = $state(highest);

  $effect(() => {
    const subscription = query.subscribe(({ data }) => {
      if (!data) return;

      highest = Math.max(highest, data.total);
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
