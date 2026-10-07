import type { VipGateway } from '$lib/requests/models/VipGateway.ts';

export function isStripeGateway(gateway: VipGateway | Nil): boolean {
  return gateway === 'stripe';
}
