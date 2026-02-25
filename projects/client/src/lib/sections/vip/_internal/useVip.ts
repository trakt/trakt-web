import { startCheckoutQuery } from '$lib/requests/vip/startCheckoutQuery.ts';
import { BehaviorSubject } from 'rxjs';
import type { VipPlan } from './models/VipPlan.ts';

type UseVipProps = {
  plan: VipPlan;
};

export function useVip({ plan }: UseVipProps) {
  const isFetching = new BehaviorSubject(false);

  const returnUrl = globalThis.window.location.href;

  return {
    startCheckout: async () => {
      //FIXME add tracking

      isFetching.next(true);
      const result = await startCheckoutQuery({ type: plan.type, returnUrl });
      isFetching.next(false);
      return result;
    },
    isFetching: isFetching.asObservable(),
  };
}
