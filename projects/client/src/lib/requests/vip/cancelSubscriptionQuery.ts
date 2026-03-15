import { rawApiFetch } from '$lib/requests/api.ts';
import { isValidResponse } from '../../features/query/_internal/isValidResponse.ts';

export async function cancelSubscriptionQuery(): Promise<boolean> {
  const response = await rawApiFetch({
    path: '/vip/stripe/cancel',
    init: {
      method: 'POST',
    },
  });

  return isValidResponse(response, 'cancelSubscription');
}
