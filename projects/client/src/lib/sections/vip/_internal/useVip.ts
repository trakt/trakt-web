import { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '$lib/features/analytics/useTrack.ts';
import { defineMutation } from '$lib/features/query/defineMutation.ts';
import { useMutation } from '$lib/features/query/useMutation.ts';
import { useQuery } from '$lib/features/query/useQuery.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { cancelSubscriptionQuery } from '$lib/requests/vip/cancelSubscriptionQuery.ts';
import { confirmCheckoutQuery } from '$lib/requests/vip/confirmCheckoutQuery.ts';
import { manageSubscriptionQuery } from '$lib/requests/vip/manageSubscriptionQuery.ts';
import { startCheckoutQuery } from '$lib/requests/vip/startCheckoutQuery.ts';
import { vipPlansQuery } from '$lib/requests/vip/vipPlansQuery.ts';
import { vipSubscriptionQuery } from '$lib/requests/vip/vipSubscriptionQuery.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import { UrlBuilder } from '$lib/utils/url/UrlBuilder.ts';
import { setCacheBuster } from '$lib/utils/url/setCacheBuster.ts';
import { BehaviorSubject, map } from 'rxjs';
import type { VipPlan } from './models/VipPlan.ts';
import type { VipPlanDuration } from '$lib/requests/models/VipPlanDuration.ts';
import { anyTrue } from '$lib/utils/store/anyTrue.ts';

const elevatedPlanType = new BehaviorSubject<VipPlanDuration>('yearly');

function getReturnUrl() {
  const url = new URL(UrlBuilder.vip(), globalThis.window.location.origin);
  return setCacheBuster(url).href;
}

export function useVip() {
  const { track: trackUpgrade } = useTrack(AnalyticsEvent.VipUpgrade);
  const { track: trackManage } = useTrack(AnalyticsEvent.VipManage);
  const { track: trackCancel } = useTrack(AnalyticsEvent.VipCancel);

  const subscription = useQuery(vipSubscriptionQuery());
  const plansResult = useQuery(vipPlansQuery());

  const checkout = useMutation(defineMutation({
    key: 'vip:start-checkout',
    request: (plan: VipPlan) =>
      startCheckoutQuery({
        duration: plan.type,
        returnUrl: getReturnUrl(),
      }),
    invalidations: [],
  }));

  const management = useMutation(defineMutation({
    key: 'vip:manage-subscription',
    request: () => manageSubscriptionQuery({ returnUrl: getReturnUrl() }),
    invalidations: [],
  }));

  const cancellation = useMutation(defineMutation({
    key: 'vip:cancel-subscription',
    request: () => cancelSubscriptionQuery(),
    invalidations: [InvalidateAction.Vip.Canceled],
  }));

  const confirmation = useMutation(defineMutation({
    key: 'vip:confirm-checkout',
    request: (sessionId: string) => confirmCheckoutQuery({ sessionId }),
    invalidations: [
      InvalidateAction.Vip.Updated,
      InvalidateAction.User.Settings,
    ],
  }));

  const isFetching = anyTrue([
    checkout.isPending,
    management.isPending,
    cancellation.isPending,
  ]);

  return {
    plans: plansResult.pipe(map(($plans) => $plans.data ?? [])),
    startCheckout: async (plan: VipPlan) => {
      trackUpgrade({ plan: plan.type });

      return await checkout.mutate(plan);
    },
    manageSubscription: async () => {
      trackManage();

      return await management.mutate();
    },
    cancelSubscription: async () => {
      trackCancel();

      return await cancellation.mutate();
    },
    confirmCheckout: (sessionId: string) => confirmation.mutate(sessionId),
    isFetching,
    subscription: subscription.pipe(map(($details) => $details.data)),
    isLoading: subscription.pipe(map(toLoadingState)),
    elevatedPlanType: elevatedPlanType.asObservable(),
    setElevatedPlanType: (type: VipPlanDuration) => elevatedPlanType.next(type),
  };
}
