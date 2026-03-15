import { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '$lib/features/analytics/useTrack.ts';
import { useQuery } from '$lib/features/query/useQuery.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { cancelSubscriptionQuery } from '$lib/requests/vip/cancelSubscriptionQuery.ts';
import { manageSubscriptionQuery } from '$lib/requests/vip/manageSubscriptionQuery.ts';
import { startCheckoutQuery } from '$lib/requests/vip/startCheckoutQuery.ts';
import { vipSubscriptionQuery } from '$lib/requests/vip/vipSubscriptionQuery.ts';
import { useInvalidator } from '$lib/stores/useInvalidator.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import { UrlBuilder } from '$lib/utils/url/UrlBuilder.ts';
import { setCacheBuster } from '$lib/utils/url/setCacheBuster.ts';
import { BehaviorSubject, map } from 'rxjs';
import type { VipPlan } from './models/VipPlan.ts';

function getReturnUrl() {
  const url = new URL(UrlBuilder.vip(), globalThis.window.location.origin);
  return setCacheBuster(url).href;
}

export function useVip() {
  const { track: trackUpgrade } = useTrack(AnalyticsEvent.VipUpgrade);
  const { track: trackManage } = useTrack(AnalyticsEvent.VipManage);
  const { track: trackCancel } = useTrack(AnalyticsEvent.VipCancel);

  const { invalidate } = useInvalidator();

  const isFetching = new BehaviorSubject(false);

  const subscription = useQuery(vipSubscriptionQuery());

  return {
    startCheckout: async (plan: VipPlan) => {
      trackUpgrade({ plan: plan.type });

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
    manageSubscription: async () => {
      trackManage();

      isFetching.next(true);
      try {
        return await manageSubscriptionQuery({
          returnUrl: getReturnUrl(),
        });
      } finally {
        isFetching.next(false);
      }
    },
    cancelSubscription: async () => {
      trackCancel();

      isFetching.next(true);
      try {
        await cancelSubscriptionQuery();
        await invalidate(InvalidateAction.Vip.Canceled);
      } finally {
        isFetching.next(false);
      }
    },
    isFetching: isFetching.asObservable(),
    subscription: subscription.pipe(map(($details) => $details.data)),
    isLoading: subscription.pipe(map(toLoadingState)),
  };
}
