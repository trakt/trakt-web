import { useQuery } from '$lib/features/query/useQuery.ts';
import { userLimitsQuery } from '$lib/requests/queries/vip/userLimitsQuery.ts';
import { startCheckoutQuery } from '$lib/requests/vip/startCheckoutQuery.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import { BehaviorSubject, map } from 'rxjs';
import type { VipPlan } from './models/VipPlan.ts';

export function useVip() {
  const isFetching = new BehaviorSubject(false);

  const query = useQuery(userLimitsQuery());

  const returnUrl = globalThis.window.location.href;

  return {
    startCheckout: async (plan: VipPlan) => {
      //FIXME add tracking

      isFetching.next(true);
      const result = await startCheckoutQuery({ type: plan.type, returnUrl });
      isFetching.next(false);
      return result;
    },
    isFetching: isFetching.asObservable(),
    limits: query.pipe(map(($limits) => $limits.data)),
    isLoadingLimits: query.pipe(map(toLoadingState)),
  };
}
