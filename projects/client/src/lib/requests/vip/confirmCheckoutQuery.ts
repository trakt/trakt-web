import { rawApiFetch } from '$lib/requests/api.ts';
import { isValidResponse } from '../../features/query/_internal/isValidResponse.ts';

type ConfirmCheckoutParams = {
  sessionId: string;
};

export async function confirmCheckoutQuery(
  { sessionId }: ConfirmCheckoutParams,
): Promise<boolean> {
  const response = await rawApiFetch({
    path: `/vip/stripe/confirm?session_id=${encodeURIComponent(sessionId)}`,
    init: {
      method: 'POST',
    },
  });

  return isValidResponse(response, 'confirmCheckout');
}
