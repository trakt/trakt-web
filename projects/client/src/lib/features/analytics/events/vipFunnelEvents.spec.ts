import { describe, expect, it } from 'vitest';
import { AnalyticsEvent } from './AnalyticsEvent.ts';

describe('analytics: vip funnel events', () => {
  it('should use the event names registered with the server', () => {
    expect([
      AnalyticsEvent.VipUpsell,
      AnalyticsEvent.VipUpsellImpression,
      AnalyticsEvent.VipView,
      AnalyticsEvent.VipUpgrade,
      AnalyticsEvent.VipCheckoutFailed,
      AnalyticsEvent.VipCheckoutCanceled,
      AnalyticsEvent.VipConfirmed,
      AnalyticsEvent.VipConfirmFailed,
      AnalyticsEvent.VipGate,
    ]).toEqual([
      'action.vip-upsell',
      'action.vip-upsell-impression',
      'vip-action.vip-view',
      'vip-action.vip-upgrade',
      'vip-action.checkout-failed',
      'vip-action.checkout-canceled',
      'vip-action.vip-confirmed',
      'vip-action.confirm-failed',
      'vip-action.vip-gate',
    ]);
  });
});
