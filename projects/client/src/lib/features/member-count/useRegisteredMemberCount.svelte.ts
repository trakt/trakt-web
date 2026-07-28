import { useProjectedCount } from '$lib/features/member-count/useProjectedCount.svelte.ts';
import { useQuery } from '$lib/features/query/useQuery.ts';
import type { RegisteredMemberCount } from '$lib/requests/models/RegisteredMemberCount.ts';
import { registeredMemberCountQuery } from '$lib/requests/queries/stats/registeredMemberCountQuery.ts';

// First-paint value, and the fallback when the endpoint is down: never a zero,
// a spinner, or a width that reflows. `ratePerDay: 0` keeps it static until the
// server anchor lands; monotonicity means it can only be corrected upward.
// Bump on milestones.
const REGISTERED_MEMBER_FLOOR: RegisteredMemberCount = {
  total: 17_000_000,
  anchoredAt: 0,
  ratePerDay: 0,
};

/**
 * Live registered-account total for the about page: polls the public stats
 * endpoint and animates between anchors off the measured signup rate.
 */
export function useRegisteredMemberCount() {
  const query = useQuery(registeredMemberCountQuery());

  // Copied, not the constant itself: `$state` proxies its target, so seeding it
  // directly would let a property write reach module state.
  let anchor = $state({ ...REGISTERED_MEMBER_FLOOR });

  $effect(() => {
    const subscription = query.subscribe(({ data }) => {
      if (data) anchor = data;
    });

    return () => subscription.unsubscribe();
  });

  const projected = useProjectedCount(() => anchor);

  return {
    get value() {
      return projected.value;
    },
    // Floored, not live, so SSR and every later frame reserve the same width.
    get reserveFor() {
      return Math.max(REGISTERED_MEMBER_FLOOR.total, anchor.total);
    },
  };
}
