import { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '$lib/features/analytics/useTrack.ts';
import { useUser } from '$lib/features/auth/stores/useUser.ts';
import { whenSeenFor } from '$lib/utils/actions/whenSeenFor.ts';
import { filter, take } from 'rxjs';
import type { VipUpsellSource } from './models/VipUpsellSource.ts';

const IMPRESSION_DURATION_MS = 1000;

export function useVipUpsell(getSource: () => VipUpsellSource | Nil) {
  const { track: trackUpsell } = useTrack(AnalyticsEvent.VipUpsell);
  const { track: trackUpsellImpression } = useTrack(
    AnalyticsEvent.VipUpsellImpression,
  );
  const { user } = useUser();

  const trackClick = () => {
    const source = getSource();
    if (!source) return;

    trackUpsell({ source });
  };

  const trackImpression = (element: HTMLElement) => {
    if (!getSource()) return;

    return whenSeenFor(element, {
      callback: () =>
        user.pipe(filter(Boolean), take(1)).subscribe(({ isVip }) => {
          const source = getSource();
          if (isVip || !source) return;

          trackUpsellImpression({ source });
        }),
      duration: IMPRESSION_DURATION_MS,
    });
  };

  return { trackClick, trackImpression };
}
