import { rawApiFetch } from '$lib/requests/api.ts';

export async function claimRetentionOfferQuery(): Promise<boolean> {
  const response = await rawApiFetch({
    path: '/vip/stripe/retention-offer',
    init: {
      method: 'POST',
    },
  });

  return response.ok;
}
