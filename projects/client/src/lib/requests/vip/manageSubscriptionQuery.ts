import { rawApiFetch } from '$lib/requests/api.ts';
import type { ManageSubscriptionResult } from '$lib/requests/models/ManageSubscriptionResult.ts';
import { isMissingSubscription } from './_internal/isMissingSubscription.ts';
import { StripeCheckoutResponseSchema } from './_internal/StripeCheckoutResponseSchema.ts';
import { subscriptionRequestError } from './_internal/subscriptionRequestError.ts';

const noContent = 204;

type ManageSubscriptionParams = {
  returnUrl: string;
};

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

  if (!response.ok) {
    throw subscriptionRequestError('manageSubscription', response);
  }

  if (response.status === noContent) {
    return { kind: 'unavailable' };
  }

  const body = StripeCheckoutResponseSchema.parse(await response.json());
  return { kind: 'redirect', url: body.checkout_url };
}
