import { rawApiFetch } from '$lib/requests/api.ts';
import { isMissingSubscription } from './_internal/isMissingSubscription.ts';
import { subscriptionRequestError } from './_internal/subscriptionRequestError.ts';

export async function cancelSubscriptionQuery(): Promise<boolean> {
  const response = await rawApiFetch({
    path: '/vip/stripe/cancel',
    init: {
      method: 'POST',
    },
  });

  if (isMissingSubscription(response)) {
    return false;
  }

  if (!response.ok) {
    throw subscriptionRequestError('cancelSubscription', response);
  }

  return true;
}
