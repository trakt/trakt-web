import type { StreamingConnection } from '$lib/requests/models/StreamingConnection.ts';
import type { UserLimits } from '$lib/requests/models/UserLimits.ts';
import type { VipSubscription } from '$lib/requests/models/VipSubscription.ts';
import type { VipDealPlan } from '../../models/VipDealPlan.ts';
import type { VipCancelLimit } from '../models/VipCancelLimit.ts';
import type { VipCancelLoss } from '../models/VipCancelLoss.ts';
import type { VipCancelSummary } from '../models/VipCancelSummary.ts';
import type { VipRetentionOffer } from '../models/VipRetentionOffer.ts';
import { pickBestVipOffer } from './pickBestVipOffer.ts';

const TWO_YEAR_MONTHS = 24;
const MINUTES_PER_HOUR = 60;
const MS_PER_MONTH = 30.44 * 24 * 60 * 60 * 1000;

type ToVipCancelSummaryParams = {
  subscription: VipSubscription | Nil;
  dealPlan: VipDealPlan | Nil;
  limits: UserLimits | Nil;
  stats: { plays: number; minutes: number; ratings: number } | Nil;
  streaming: ReadonlyArray<StreamingConnection>;
  plex: { scrobbleEvents: number; syncedServers: number } | Nil;
  now: Date;
};

const isCancellable = (
  subscription: VipSubscription | Nil,
): subscription is VipSubscription & { renewsAt: Date } =>
  subscription != null &&
  subscription.type !== 'life' &&
  !subscription.isCancelled &&
  subscription.renewsAt != null;

const toRetentionOffer = (
  offer: VipSubscription['retentionOffer'],
): VipRetentionOffer | null =>
  offer
    ? {
      source: 'retention',
      discountedAmount: offer.discountedAmount,
      totalPrice: offer.amount,
      monthlyAmount: offer.discountedAmount / TWO_YEAR_MONTHS,
    }
    : null;

const toCampaignOffer = (plan: VipDealPlan | Nil): VipRetentionOffer | null =>
  plan
    ? {
      source: 'campaign',
      discountedAmount: plan.discount.discountedAmount,
      totalPrice: plan.totalPrice,
      monthlyAmount: plan.discount.discountedAmountMonthly,
    }
    : null;

const toStreamingLoss = (
  connections: ReadonlyArray<StreamingConnection>,
): VipCancelLoss | null => {
  const connected = connections
    .filter(({ isConnected }) => isConnected)
    .toSorted((a, b) =>
      (b.lastSyncedAt?.getTime() ?? 0) - (a.lastSyncedAt?.getTime() ?? 0)
    );
  const unlinked = connected.slice(1).map(({ name }) => name);

  return unlinked.length > 0 ? { kind: 'streaming', services: unlinked } : null;
};

const toPlexLosses = (
  plex: ToVipCancelSummaryParams['plex'],
): ReadonlyArray<VipCancelLoss> => {
  if (!plex) return [];

  const scrobbling: ReadonlyArray<VipCancelLoss> = plex.scrobbleEvents > 0
    ? [{ kind: 'plex-scrobbling' }]
    : [];
  const servers: ReadonlyArray<VipCancelLoss> = plex.syncedServers > 1
    ? [{ kind: 'plex-servers', count: plex.syncedServers - 1 }]
    : [];

  return [...scrobbling, ...servers];
};

const toLibrary = (limits: UserLimits | Nil): ReadonlyArray<VipCancelLimit> => {
  if (!limits) return [];

  const items: ReadonlyArray<
    [VipCancelLimit['item'], UserLimits[keyof UserLimits]]
  > = [
    ['watchlist', limits.watchlistItems],
    ['collection', limits.digitalLibrary],
    ['notes', limits.totalNotes],
    ['smart-lists', limits.dynamicLists],
    ['connected-apps', limits.connectedApps],
  ];

  return items
    .filter(([, { current, free }]) => current > free)
    .map(([item, { current, free, vip }]) => ({ item, current, free, vip }));
};

export function toVipCancelSummary(
  params: ToVipCancelSummaryParams,
): VipCancelSummary | null {
  const { subscription, now } = params;
  if (!isCancellable(subscription)) return null;

  const memberSince = subscription.memberSince ?? now;
  const streamingLoss = toStreamingLoss(params.streaming);

  return {
    endsAt: subscription.renewsAt,
    vipMonths: Math.max(
      0,
      Math.floor((now.getTime() - memberSince.getTime()) / MS_PER_MONTH),
    ),
    gateway: subscription.gateway,
    manageUrl: subscription.manageUrl,
    offer: subscription.gateway === 'stripe'
      ? pickBestVipOffer([
        toRetentionOffer(subscription.retentionOffer),
        toCampaignOffer(params.dealPlan),
      ])
      : null,
    stats: {
      plays: params.stats?.plays ?? 0,
      hours: Math.round((params.stats?.minutes ?? 0) / MINUTES_PER_HOUR),
      ratings: params.stats?.ratings ?? 0,
    },
    losses: [
      ...(streamingLoss ? [streamingLoss] : []),
      ...toPlexLosses(params.plex),
    ],
    library: toLibrary(params.limits),
  };
}
