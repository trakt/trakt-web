import type { VipGateway } from '$lib/requests/models/VipGateway.ts';

export function isPaypalGateway(gateway: VipGateway | Nil): boolean {
  return gateway === 'paypal' || gateway === 'paypal_api';
}
