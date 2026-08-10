import { rawApiFetch } from '$lib/requests/api.ts';
import type { ManageSubscriptionResult } from '$lib/requests/models/ManageSubscriptionResult.ts';
import z from 'zod';
import { isValidResponse } from '../../features/query/_internal/isValidResponse.ts';
import { isMissingSubscription } from './_internal/isMissingSubscription.ts';
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
): Promise<ManageSubscriptionResult> {
  const encodedUrl = encodeURIComponent(returnUrl);

  const response = await rawApiFetch({
    path:
      `/vip/stripe/update?success_url=${encodedUrl}&cancel_url=${encodedUrl}`,
    init: {
      method: 'POST',
    },
  });

  if (isMissingSubscription(response)) {
    return { kind: 'missing-subscription' };
  }

  if (!isValidResponse(response, 'manageSubscription')) {
    return { kind: 'unavailable' };
  }

  const body = ManageSubscriptionResponseSchema.parse(await response.json());
  return { kind: 'redirect', url: body.checkout_url };
}
