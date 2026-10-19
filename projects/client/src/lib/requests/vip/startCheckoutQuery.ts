import { rawApiFetch } from '$lib/requests/api.ts';
import { isValidResponse } from '../../features/query/_internal/isValidResponse.ts';
import type { VipPlanDuration } from '../models/VipPlanDuration.ts';
import { StripeCheckoutResponseSchema } from './_internal/StripeCheckoutResponseSchema.ts';

type StartCheckoutParams = {
  duration: VipPlanDuration;
  successUrl: string;
  cancelUrl: string;
};

export async function startCheckoutQuery({
  duration,
  successUrl,
  cancelUrl,
}: StartCheckoutParams): Promise<string | Nil> {
  const response = await rawApiFetch({
    path: `/vip/stripe/create?duration=${duration}&success_url=${encodeURIComponent(successUrl)}&cancel_url=${encodeURIComponent(cancelUrl)}`,
    init: {
      method: 'POST',
    },
  });

  if (!isValidResponse(response, 'startCheckout')) {
    return;
  }

  const body = StripeCheckoutResponseSchema.parse(await response.json());
  return body.checkout_url;
}
