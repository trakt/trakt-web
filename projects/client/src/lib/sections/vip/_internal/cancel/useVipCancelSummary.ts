import { useQuery } from '$lib/features/query/useQuery.ts';
import { plexSettingsQuery } from '$lib/requests/plex/plexSettingsQuery.ts';
import { streamingConnectionsQuery } from '$lib/requests/queries/streaming-sync/streamingConnectionsQuery.ts';
import { userStatsQuery } from '$lib/requests/queries/users/userStatsQuery.ts';
import { userLimitsQuery } from '$lib/requests/queries/vip/userLimitsQuery.ts';
import { vipPlansQuery } from '$lib/requests/vip/vipPlansQuery.ts';
import { vipSubscriptionQuery } from '$lib/requests/vip/vipSubscriptionQuery.ts';
import { combineLatest, filter, map, startWith, take } from 'rxjs';
import { findTwoYearDealPlan } from '../utils/findTwoYearDealPlan.ts';
import type { VipCancelState } from './models/VipCancelState.ts';
import { toVipCancelSummary } from './utils/toVipCancelSummary.ts';

const isSettled = (results: ReadonlyArray<{ status: string }>) =>
  results.every(({ status }) => status !== 'pending');

export function useVipCancelSummary() {
  const queries = combineLatest([
    useQuery(vipSubscriptionQuery()),
    useQuery(vipPlansQuery()),
    useQuery(userLimitsQuery()),
    useQuery(userStatsQuery({ slug: 'me' })),
    useQuery(streamingConnectionsQuery()),
    useQuery(plexSettingsQuery()),
  ]);

  const state = queries.pipe(
    filter((results) => isSettled(results)),
    take(1),
    map(
      (
        [subscription, plans, limits, stats, streaming, plex],
      ): VipCancelState => {
        const summary = toVipCancelSummary({
          subscription: subscription.data,
          dealPlan: findTwoYearDealPlan(plans.data ?? []),
          limits: limits.data,
          stats: stats.data
            ? {
              plays: stats.data.totalPlays,
              minutes: stats.data.totalMinutes,
              ratings: stats.data.ratings.total,
            }
            : null,
          streaming: streaming.data ?? [],
          plex: plex.data
            ? {
              scrobbleEvents: plex.data.webhook.eventCount,
              syncedServers: plex.data.sync.selection.serverIds.length,
            }
            : null,
          now: new Date(),
        });

        return summary ? { kind: 'ready', summary } : { kind: 'ineligible' };
      },
    ),
    startWith<VipCancelState>({ kind: 'loading' }),
  );

  return { state };
}
