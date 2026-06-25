import {
  type VipSubscriptionResponse,
  VipSubscriptionResponseSchema,
} from '$lib/requests/models/VipSubscriptionResponse.ts';
import { describe, expect, it } from 'vitest';
import { mapToVipSubscription } from './mapToVipSubscription.ts';

function buildResponse(
  override: Partial<VipSubscriptionResponse> = {},
): VipSubscriptionResponse {
  return {
    vip: true,
    vip_ep: false,
    vip_og: false,
    vip_years: 3,
    cancelled: false,
    days_left: 42,
    transactions: [],
    vip_signed_up_at: '2021-01-01T00:00:00.000Z',
    expires_at: '2026-08-01T00:00:00.000Z',
    gateway: 'stripe',
    type: 'yearly',
    plan: 'yearly_2024_08',
    renewal: {
      date: '2026-08-01T00:00:00.000Z',
      plan: 'yearly_2024_08',
      duration: 'yearly',
      price: { usd: '30.00', readable: '$30.00' },
    },
    ...override,
  };
}

describe('mapToVipSubscription', () => {
  it('should return null when the response is absent', () => {
    expect(mapToVipSubscription(undefined)).toBeNull();
  });

  it('should return null when the user has no active VIP type', () => {
    expect(mapToVipSubscription(buildResponse({ type: null }))).toBeNull();
  });

  it('should carry the enriched fields from /vip/details', () => {
    const subscription = mapToVipSubscription(buildResponse());

    expect(subscription).toMatchObject({
      type: 'yearly',
      plan: 'yearly_2024_08',
      gateway: 'stripe',
      isCancelled: false,
      vipYears: 3,
      daysLeft: 42,
      renewalPrice: { usd: '30.00', readable: '$30.00' },
      manageUrl: null,
    });
    expect(subscription?.memberSince).toEqual(
      new Date('2021-01-01T00:00:00.000Z'),
    );
    expect(subscription?.renewsAt).toEqual(
      new Date('2026-08-01T00:00:00.000Z'),
    );
  });

  it('should normalise an empty-string gateway to null', () => {
    const subscription = mapToVipSubscription(buildResponse({ gateway: '' }));
    expect(subscription?.gateway).toBeNull();
  });

  it('should expose the server-built manage_url for non-Stripe gateways', () => {
    const subscription = mapToVipSubscription(
      buildResponse({
        gateway: 'paypal',
        manage_url: 'https://www.paypal.com/myaccount/autopay/connect/I-ABC123',
      }),
    );

    expect(subscription?.manageUrl).toBe(
      'https://www.paypal.com/myaccount/autopay/connect/I-ABC123',
    );
  });

  it('should leave renewalPrice null when there is no renewal', () => {
    const subscription = mapToVipSubscription(
      buildResponse({ renewal: undefined }),
    );

    expect(subscription?.renewalPrice).toBeNull();
    expect(subscription?.renewsAt).toBeNull();
  });

  it('should map transactions, renaming fields and parsing dates', () => {
    const subscription = mapToVipSubscription(
      buildResponse({
        transactions: [
          {
            id: 1,
            gateway: 'stripe',
            transaction_type: 'payment',
            created_at: '2025-08-01T00:00:00.000Z',
            vip_type: 'yearly',
            vip_plan: 'yearly_2024_08',
            amount: '30.00',
            currency: 'USD',
            coupon_code: '50PERCENTYEAR1',
            trial_months: null,
          },
        ],
      }),
    );

    expect(subscription?.transactions).toEqual([
      {
        id: 1,
        gateway: 'stripe',
        type: 'payment',
        vipType: 'yearly',
        amount: '30.00',
        currency: 'USD',
        couponCode: '50PERCENTYEAR1',
        createdAt: new Date('2025-08-01T00:00:00.000Z'),
      },
    ]);
  });

  it('should parse a real /vip/details payload whose money fields are numeric', () => {
    // The API returns renewal `usd` as a number (and may do the same for a
    // transaction `amount`); the whole payload must still parse and map.
    const rawResponse = {
      vip: true,
      vip_ep: false,
      vip_og: false,
      vip_years: 9,
      vip_signed_up_at: '2014-08-15T07:40:36.000Z',
      expires_at: '2029-08-27T22:08:54.000Z',
      gateway: 'paypal',
      type: 'yearly',
      plan: 'yearly_2024_08',
      cancelled: false,
      days_left: 1159,
      manage_url:
        'https://www.paypal.com/myaccount/autopay/connect/I-0MV069E35FF4',
      renewal: {
        date: '2025-08-27T22:08:54.000Z',
        plan: 'yearly_2024_08',
        duration: 'yearly',
        price: { usd: 60, readable: '$60.00 per year' },
      },
      transactions: [
        {
          id: 291584,
          gateway: 'paypal',
          transaction_type: 'payment',
          vip_type: 'yearly',
          vip_plan: 'yearly_2024_08',
          amount: '30.0',
          currency: 'usd',
          coupon_code: null,
          trial_months: null,
          created_at: '2024-08-27T22:08:54.000Z',
        },
      ],
    };

    const parsed = VipSubscriptionResponseSchema.parse(rawResponse);
    const subscription = mapToVipSubscription(parsed);

    expect(subscription).toMatchObject({
      type: 'yearly',
      gateway: 'paypal',
      vipYears: 9,
      renewalPrice: { usd: 60, readable: '$60.00 per year' },
      manageUrl:
        'https://www.paypal.com/myaccount/autopay/connect/I-0MV069E35FF4',
    });
    expect(subscription?.transactions).toHaveLength(1);
  });
});
