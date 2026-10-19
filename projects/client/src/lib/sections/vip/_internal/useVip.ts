import { page } from '$app/state';
import { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '$lib/features/analytics/useTrack.ts';
import { defineMutation } from '$lib/features/query/defineMutation.ts';
import { useMutation } from '$lib/features/query/useMutation.ts';
import { useQuery } from '$lib/features/query/useQuery.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { cancelSubscriptionQuery } from '$lib/requests/vip/cancelSubscriptionQuery.ts';
import { claimRetentionOfferQuery } from '$lib/requests/vip/claimRetentionOfferQuery.ts';
import { confirmCheckoutQuery } from '$lib/requests/vip/confirmCheckoutQuery.ts';
import { manageSubscriptionQuery } from '$lib/requests/vip/manageSubscriptionQuery.ts';
import { startCheckoutQuery } from '$lib/requests/vip/startCheckoutQuery.ts';
import { vipPlansQuery } from '$lib/requests/vip/vipPlansQuery.ts';
import { vipSubscriptionQuery } from '$lib/requests/vip/vipSubscriptionQuery.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import { UrlBuilder } from '$lib/utils/url/UrlBuilder.ts';
import { setCacheBuster } from '$lib/utils/url/setCacheBuster.ts';
import { map } from 'rxjs';
import type { VipFlow } from '$lib/features/upsell/models/VipFlow.ts';
import type { VipUpsellSource } from '$lib/features/upsell/models/VipUpsellSource.ts';
import type { AnalyticsEventDataMap } from '$lib/features/analytics/events/AnalyticsEventDataMap.ts';
import type { VipPlan } from './models/VipPlan.ts';
import { buildCheckoutReturnUrls } from './utils/buildCheckoutReturnUrls.ts';
import { parseVipParams } from './utils/parseVipParams.ts';
import { toVipFailureCode } from './utils/toVipFailureCode.ts';
import { anyTrue } from '$lib/utils/store/anyTrue.ts';

type CheckoutRequest = {
  plan: VipPlan;
  source: VipUpsellSource;
  flow: VipFlow;
};

function getReturnUrl() {
  const url = new URL(UrlBuilder.vip(), globalThis.window.location.origin);
  return setCacheBuster(url).href;
}

export function useVip() {
  const { track: trackUpgrade } = useTrack(AnalyticsEvent.VipUpgrade);
  const { track: trackCheckoutFailed } = useTrack(
    AnalyticsEvent.VipCheckoutFailed,
  );
  const { track: trackManage } = useTrack(AnalyticsEvent.VipManage);
  const { track: trackCancel } = useTrack(AnalyticsEvent.VipCancel);

  const subscription = useQuery(vipSubscriptionQuery());
  const plansResult = useQuery(vipPlansQuery());
  const plans = plansResult.pipe(map(($plans) => $plans.data ?? []));

  const checkout = useMutation(
    defineMutation({
      key: 'vip:start-checkout',
      request: ({ plan, source, flow }: CheckoutRequest) =>
        startCheckoutQuery({
          duration: plan.type,
          ...buildCheckoutReturnUrls({
            origin: globalThis.window.location.origin,
            plan: plan.type,
            source,
            flow,
          }),
        }),
      invalidations: [],
    }),
  );

  const management = useMutation(
    defineMutation({
      key: 'vip:manage-subscription',
      request: () => manageSubscriptionQuery({ returnUrl: getReturnUrl() }),
      invalidations: [],
    }),
  );

  const cancellation = useMutation(
    defineMutation({
      key: 'vip:cancel-subscription',
      request: () => cancelSubscriptionQuery(),
      invalidations: [InvalidateAction.Vip.Canceled],
    }),
  );

  const retentionOffer = useMutation(
    defineMutation({
      key: 'vip:claim-retention-offer',
      request: () => claimRetentionOfferQuery(),
      invalidations: [InvalidateAction.Vip.Updated],
    }),
  );

  const confirmation = useMutation(
    defineMutation({
      key: 'vip:confirm-checkout',
      request: (sessionId: string) => confirmCheckoutQuery({ sessionId }),
      invalidations: [
        InvalidateAction.Vip.Updated,
        InvalidateAction.User.Settings,
      ],
    }),
  );

  const isFetching = anyTrue([
    checkout.isPending,
    management.isPending,
    cancellation.isPending,
    retentionOffer.isPending,
  ]);

  return {
    plans,
    startCheckout: async (plan: VipPlan) => {
      const { source, flow } = parseVipParams(page.url);
      const tracking = { plan: plan.type, source, flow };
      trackUpgrade(tracking);

      try {
        const url = await checkout.mutate({ plan, source, flow });
        if (!url) {
          trackCheckoutFailed({ ...tracking, error: 'no_checkout_url' });
        }

        return url;
      } catch (error) {
        trackCheckoutFailed({ ...tracking, error: toVipFailureCode(error) });
        throw error;
      }
    },
    manageSubscription: async () => {
      trackManage();

      return await management.mutate();
    },
    cancelSubscription: async (
      data: AnalyticsEventDataMap[typeof AnalyticsEvent.VipCancel] = {},
    ) => {
      trackCancel(data);

      return await cancellation.mutate();
    },
    claimRetentionOffer: () => retentionOffer.mutate(),
    confirmCheckout: (sessionId: string) => confirmation.mutate(sessionId),
    isFetching,
    subscription: subscription.pipe(map(($details) => $details.data)),
    isLoading: subscription.pipe(map(toLoadingState)),
  };
}
