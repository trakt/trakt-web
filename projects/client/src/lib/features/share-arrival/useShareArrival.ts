import { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '$lib/features/analytics/useTrack.ts';
import { invalidateActions } from '$lib/features/query/invalidateActions.ts';
import { useQueryClient } from '$lib/features/query/_internal/queryClientContext.ts';
import { useAuth } from '$lib/features/auth/stores/useAuth.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { recordShareClickRequest } from '$lib/requests/queries/shares/recordShareClickRequest.ts';
import { PREFETCH_SHARE_PARAM } from '$lib/utils/requests/shouldPrefetch.ts';
import { toShareArrivalType } from './_internal/toShareArrivalType.ts';
import type { ShareArrivalOutcome } from './models/ShareArrivalOutcome.ts';

const SHARE_CODE_PATTERN = /^[0-9A-Za-z]{12}$/;

export function useShareArrival() {
  const { isAuthorized } = useAuth();
  const { track } = useTrack(AnalyticsEvent.ShareArrival);
  const client = useQueryClient();

  const refreshRecommendations = async () => {
    await client.cancelQueries({
      predicate: (query) =>
        query.queryKey.includes(InvalidateAction.Share.Click),
    });
    await invalidateActions({
      client,
      actions: [InvalidateAction.Share.Click],
    });
  };

  const outcomeOf = async (
    { code, url }: { code: string; url: URL },
  ): Promise<ShareArrivalOutcome> => {
    if (!SHARE_CODE_PATTERN.test(code)) return 'uncredited';
    if (!isAuthorized.value) return 'anonymous';

    const outcome = await recordShareClickRequest({
      body: { code, url: url.toString() },
    }).catch(() => null);
    if (outcome === 'recorded' || outcome === 'duplicate') {
      await refreshRecommendations();
    }
    return outcome ?? 'failed';
  };

  const report = async (
    { url, route }: { url: URL; route: string | null },
  ) => {
    const code = url.searchParams.get(PREFETCH_SHARE_PARAM);
    if (code == null) return;

    track({
      type: toShareArrivalType(route),
      outcome: await outcomeOf({ code, url }),
    });
  };

  return { report };
}
