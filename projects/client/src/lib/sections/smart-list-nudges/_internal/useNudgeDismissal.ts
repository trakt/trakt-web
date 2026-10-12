import { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '$lib/features/analytics/useTrack.ts';
import { ClientStateKey } from '$lib/features/client-state/models/ClientStateKey.ts';
import { useClientRecord } from '$lib/features/client-state/useClientRecord.ts';
import { map } from 'rxjs';
import { isNudgeDismissed } from './isNudgeDismissed.ts';

type UseNudgeDismissalProps = {
  id: string;
  maxDismissals?: number;
};

export function useNudgeDismissal(
  { id, maxDismissals = Number.POSITIVE_INFINITY }: UseNudgeDismissalProps,
) {
  const nudges = useClientRecord(
    ClientStateKey.DismissedSmartListNudges,
  );
  const { track } = useTrack(AnalyticsEvent.BannerDismiss);

  const dismiss = () => {
    nudges.update(id, (record) => ({
      dismissedAt: Date.now(),
      count: (record?.count ?? 0) + 1,
    }));
    track({ id, value: 'dismissed' });
  };

  return {
    dismiss,
    isDismissed: nudges.entry(id).pipe(
      map((record) =>
        isNudgeDismissed({ record, now: Date.now(), maxDismissals })
      ),
    ),
  };
}
