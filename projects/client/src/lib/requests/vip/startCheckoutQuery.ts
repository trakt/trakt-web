import { rawApiFetch } from '$lib/requests/api.ts';
import z from 'zod';
import { isValidResponse } from '../../features/query/_internal/isValidResponse.ts';
import type { VipPlanDuration } from '../models/VipPlanDuration.ts';

const STRIPE_HOSTNAME = 'stripe.com';

type StartCheckoutParams = {
  duration: VipPlanDuration;
  returnUrl: string;
};

function isStripeCheckoutUrl(value: string) {
  try {
    const { protocol, hostname } = new URL(value);
    return protocol === 'https:' && hostname.endsWith(`.${STRIPE_HOSTNAME}`);
  } catch {
    return false;
  }
}

const StartCheckoutResponseSchema = z.object({
  checkout_url: z.string().refine(isStripeCheckoutUrl, {
    message: 'Checkout URL must be a valid Stripe URL',
  }),
});

export async function startCheckoutQuery(
  { duration, returnUrl }: StartCheckoutParams,
): Promise<string | Nil> {
  const url = encodeURIComponent(returnUrl);

  const response = await rawApiFetch({
    path:
      `/vip/stripe/create?duration=${duration}&success_url=${url}&cancel_url=${url}`,
    init: {
      method: 'POST',
    },
  });

  if (!isValidResponse(response, 'startCheckout')) {
    return;
  }

  const body = StartCheckoutResponseSchema.parse(await response.json());
  return body.checkout_url;
}
