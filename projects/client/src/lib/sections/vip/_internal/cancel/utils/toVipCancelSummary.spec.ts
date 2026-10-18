import type { StreamingConnection } from '$lib/requests/models/StreamingConnection.ts';
import type { UserLimits } from '$lib/requests/models/UserLimits.ts';
import type { VipSubscription } from '$lib/requests/models/VipSubscription.ts';
import { describe, expect, it } from 'vitest';
import type { VipDealPlan } from '../../models/VipDealPlan.ts';
import { toVipCancelSummary } from './toVipCancelSummary.ts';

const NOW = new Date('2026-10-07T00:00:00.000Z');

const subscription: VipSubscription = {
  type: 'yearly',
  plan: 'yearly_2024_08',
  memberSince: new Date('2022-03-01T00:00:00.000Z'),
  renewsAt: new Date('2027-02-25T00:00:00.000Z'),
  expiresAt: new Date('2027-02-25T00:00:00.000Z'),
  gateway: 'stripe',
  isCancelled: false,
  vipYears: 4,
  daysLeft: 141,
  renewalPrice: null,
  manageUrl: null,
  retentionOffer: null,
  transactions: [],
};

const limit = (current: number, free: number) => ({ current, free, vip: 100 });

const limits: UserLimits = {
  history: limit(1, 10),
  ratings: limit(1, 10),
  watchlistItems: limit(1480, 1000),
  totalListItems: limit(1, 10),
  staticLists: limit(1, 10),
  dynamicLists: limit(2, 5),
  digitalLibrary: limit(1860, 1000),
  totalNotes: limit(10, 100),
  connectedApps: limit(1, 2),
};

const connection = (
  name: string,
  lastSyncedAt: string | null,
  isConnected = true,
): StreamingConnection => ({
  id: name,
  key: name,
  name,
  isConnectable: true,
  isConnected,
  isActive: true,
  lastSyncedAt: lastSyncedAt ? new Date(lastSyncedAt) : null,
});

const dealPlan: VipDealPlan = {
  type: 'two_years',
  monthlyPrice: 69,
  totalPrice: 1337,
  durationInMonths: 24,
  isPopular: false,
  discount: {
    discountedAmount: 420,
    discountedAmountMonthly: 17.5,
    firstTermOnly: true,
  },
};

const build = (
  overrides: Partial<Parameters<typeof toVipCancelSummary>[0]> = {},
) =>
  toVipCancelSummary({
    subscription,
    dealPlan: null,
    limits,
    stats: { plays: 1240, minutes: 131400, ratings: 312 },
    streaming: [],
    plex: null,
    now: NOW,
    ...overrides,
  });

describe('util: toVipCancelSummary', () => {
  it('should not allow cancelling a lifetime membership', () => {
    expect(
      build({ subscription: { ...subscription, type: 'life' } }),
    ).toBeNull();
  });

  it('should not allow cancelling an already cancelled subscription', () => {
    expect(
      build({ subscription: { ...subscription, isCancelled: true } }),
    ).toBeNull();
  });

  it('should not allow cancelling without a subscription', () => {
    expect(build({ subscription: null })).toBeNull();
  });

  it('should summarise the membership and stats', () => {
    expect(build()).toMatchObject({
      endsAt: subscription.renewsAt,
      vipMonths: 55,
      gateway: 'stripe',
      stats: { plays: 1240, hours: 2190, ratings: 312 },
    });
  });

  it('should only list what is over a free limit', () => {
    expect(build()?.library.map(({ item }) => item)).toEqual([
      'watchlist',
      'collection',
    ]);
  });

  it('should keep the most recently synced streaming service', () => {
    const streaming = [
      connection('Max', '2026-10-01T00:00:00.000Z'),
      connection('Netflix', '2026-10-06T00:00:00.000Z'),
      connection('Disney+', null),
      connection('Hulu', '2026-10-05T00:00:00.000Z', false),
    ];

    expect(build({ streaming })?.losses).toEqual([
      { kind: 'streaming', services: ['Max', 'Disney+'] },
    ]);
  });

  it('should list Plex scrobbling and the extra Plex servers', () => {
    expect(
      build({ plex: { scrobbleEvents: 12, syncedServers: 3 } })?.losses,
    ).toEqual([
      { kind: 'plex-scrobbling' },
      { kind: 'plex-servers', count: 2 },
    ]);
  });

  it('should offer the bigger of the retention offer and a campaign', () => {
    const summary = build({
      subscription: {
        ...subscription,
        retentionOffer: {
          planCode: 'two_years',
          amount: 1337,
          discountedAmount: 1008,
        },
      },
      dealPlan,
    });

    expect(summary?.offer).toMatchObject({
      source: 'campaign',
      discountedAmount: 420,
    });
  });

  it('should offer PayPal subscribers the switch to card deal', () => {
    const summary = build({
      subscription: { ...subscription, gateway: 'paypal' },
      dealPlan,
    });

    expect(summary?.offer).toMatchObject({
      source: 'paypal-switch',
      discountedAmount: 420,
    });
    expect(summary?.switchPlan).toBe(dealPlan);
  });

  it('should ignore the retention offer for PayPal subscribers', () => {
    const summary = build({
      subscription: {
        ...subscription,
        gateway: 'paypal_api',
        retentionOffer: {
          planCode: 'two_years',
          amount: 1337,
          discountedAmount: 1008,
        },
      },
    });

    expect(summary?.offer).toBeNull();
  });

  it('should make no offer to app store subscribers', () => {
    expect(
      build({ subscription: { ...subscription, gateway: 'apple' }, dealPlan })
        ?.offer,
    ).toBeNull();
  });
});
