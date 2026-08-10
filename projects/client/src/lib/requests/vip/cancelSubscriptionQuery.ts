import { rawApiFetch } from '$lib/requests/api.ts';
import { isValidResponse } from '../../features/query/_internal/isValidResponse.ts';
import { isMissingSubscription } from './_internal/isMissingSubscription.ts';

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

  isValidResponse(response, 'cancelSubscription');
  return response.ok;
}
