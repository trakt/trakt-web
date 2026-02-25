import { rawApiFetch } from '$lib/requests/api.ts';
import { isValidResponse } from '../../features/query/_internal/isValidResponse.ts';

type StartCheckoutParams = {
  type: string;
  returnUrl: string;
};

type CheckoutResponse = {
  url: string;
};

// FIXME: actual endpoint still to be added; this implementation is subject to change

export async function startCheckoutQuery(
  { type, returnUrl }: StartCheckoutParams,
): Promise<string | Nil> {
  const response = await rawApiFetch({
    path: '/vip/stripe/create',
    init: {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ duration: type, return_to: returnUrl }),
    },
  });

  if (!isValidResponse(response, 'startCheckout')) {
    return;
  }

  const body = await response.json();
  return (body as CheckoutResponse).url;
}
