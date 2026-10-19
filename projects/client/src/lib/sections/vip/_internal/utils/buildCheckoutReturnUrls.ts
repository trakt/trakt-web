import type { VipFlow } from '$lib/features/upsell/models/VipFlow.ts';
import type { VipUpsellSource } from '$lib/features/upsell/models/VipUpsellSource.ts';
import type { VipPlanDuration } from '$lib/requests/models/VipPlanDuration.ts';
import { UrlBuilder } from '$lib/utils/url/UrlBuilder.ts';
import { setCacheBuster } from '$lib/utils/url/setCacheBuster.ts';

type CheckoutReturnParams = {
  origin: string;
  plan: VipPlanDuration;
  source: VipUpsellSource;
  flow: VipFlow;
};

export function buildCheckoutReturnUrls({
  origin,
  plan,
  source,
  flow,
}: CheckoutReturnParams) {
  const success = new URL(UrlBuilder.vip(source), origin);
  success.searchParams.set('plan', plan);
  success.searchParams.set('flow', flow);

  const cancel = new URL(success);
  cancel.searchParams.set('checkout', 'canceled');

  return {
    successUrl: setCacheBuster(success).href,
    cancelUrl: setCacheBuster(cancel).href,
  };
}
