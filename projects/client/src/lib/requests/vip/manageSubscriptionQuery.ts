import { rawApiFetch } from '$lib/requests/api.ts';
import z from 'zod';
import { isValidResponse } from '../../features/query/_internal/isValidResponse.ts';
import { isStripeUrl } from './_internal/isStripeUrl.ts';

type ManageSubscriptionParams = {
  returnUrl: string;
};

const ManageSubscriptionResponseSchema = z.object({
  checkout_url: z.string().refine(isStripeUrl, {
    message: 'Checkout URL must be a valid Stripe URL',
  }),
});

export async function manageSubscriptionQuery(
  { returnUrl }: ManageSubscriptionParams,
): Promise<string | Nil> {
  const url = encodeURIComponent(returnUrl);

  const response = await rawApiFetch({
    path: `/vip/stripe/update?success_url=${url}&cancel_url=${url}`,
    init: {
      method: 'POST',
    },
  });

  if (!isValidResponse(response, 'manageSubscription')) {
    return;
  }

  const body = ManageSubscriptionResponseSchema.parse(await response.json());
  return body.checkout_url;
}
