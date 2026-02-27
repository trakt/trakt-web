import { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '$lib/features/analytics/useTrack.ts';
import { useQuery } from '$lib/features/query/useQuery.ts';
import { userLimitsQuery } from '$lib/requests/queries/vip/userLimitsQuery.ts';
import { startCheckoutQuery } from '$lib/requests/vip/startCheckoutQuery.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import { setCacheBuster } from '$lib/utils/url/setCacheBuster.ts';
import { BehaviorSubject, map } from 'rxjs';
import type { VipPlan } from './models/VipPlan.ts';

function getReturnUrl() {
  const url = new URL(globalThis.window.location.href);
  return setCacheBuster(url).href;
}

export function useVip() {
  const { track } = useTrack(AnalyticsEvent.VipUpgrade);

  const isFetching = new BehaviorSubject(false);

  const query = useQuery(userLimitsQuery());

  return {
    startCheckout: async (plan: VipPlan) => {
      track({ plan: plan.type });

      isFetching.next(true);
      try {
        return await startCheckoutQuery({
          duration: plan.type,
          returnUrl: getReturnUrl(),
        });
      } finally {
        isFetching.next(false);
      }
    },
    isFetching: isFetching.asObservable(),
    limits: query.pipe(map(($limits) => $limits.data)),
    isLoadingLimits: query.pipe(map(toLoadingState)),
  };
}
