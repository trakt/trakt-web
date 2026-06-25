import type { VipSubscription } from '$lib/requests/models/VipSubscription.ts';
import type { VipSubscriptionResponse } from '$lib/requests/models/VipSubscriptionResponse.ts';
import type { VipTransaction } from '$lib/requests/models/VipTransaction.ts';

function mapToDate(value: string | Nil): Date | null {
  return value ? new Date(value) : null;
}

function mapToTransaction(
  transaction: VipSubscriptionResponse['transactions'][number],
): VipTransaction {
  return {
    id: transaction.id,
    gateway: transaction.gateway,
    type: transaction.transaction_type,
    vipType: transaction.vip_type,
    amount: transaction.amount,
    currency: transaction.currency?.toUpperCase() ?? null,
    couponCode: transaction.coupon_code,
    createdAt: new Date(transaction.created_at),
  };
}

export function mapToVipSubscription(
  response?: VipSubscriptionResponse,
): VipSubscription | Nil {
  if (!response || !response.type) {
    return null;
  }

  return {
    type: response.type,
    plan: response.plan,
    memberSince: mapToDate(response.vip_signed_up_at),
    renewsAt: mapToDate(response.renewal?.date),
    expiresAt: mapToDate(response.expires_at),
    gateway: response.gateway === '' ? null : response.gateway,
    isCancelled: response.cancelled,
    vipYears: response.vip_years,
    daysLeft: response.days_left,
    renewalPrice: response.renewal?.price ?? null,
    manageUrl: response.manage_url ?? null,
    transactions: response.transactions.map(mapToTransaction),
  };
}
