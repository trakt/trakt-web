import type { VipFlow } from '$lib/features/upsell/models/VipFlow.ts';
import type { VipUpsellSource } from '$lib/features/upsell/models/VipUpsellSource.ts';
import type { VipPlanDuration } from '$lib/requests/models/VipPlanDuration.ts';
import { UrlBuilder } from '$lib/utils/url/UrlBuilder.ts';
import { setCacheBuster } from '$lib/utils/url/setCacheBuster.ts';
import { toCheckoutReturnUrl } from './toCheckoutReturnUrl.ts';

type CheckoutReturnParams = {
  origin: string;
  plan: VipPlanDuration;
  source: VipUpsellSource;
  flow: VipFlow;
  returnUrl?: string | Nil;
};

export function buildCheckoutReturnUrls({
  origin,
  plan,
  source,
  flow,
  returnUrl,
}: CheckoutReturnParams) {
  const success = new URL(UrlBuilder.vip(source), origin);
  success.searchParams.set('plan', plan);
  success.searchParams.set('flow', flow);

  const cancel = new URL(success);
  cancel.searchParams.set('checkout', 'canceled');

  return {
    successUrl: toCheckoutReturnUrl(returnUrl) ?? setCacheBuster(success).href,
    cancelUrl: setCacheBuster(cancel).href,
  };
}
