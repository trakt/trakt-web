import { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '$lib/features/analytics/useTrack.ts';
import { ClientStateKey } from '$lib/features/client-state/models/ClientStateKey.ts';
import { useClientRecord } from '$lib/features/client-state/useClientRecord.ts';
import { map } from 'rxjs';

export function useBannerDismissal(id: string, value: string) {
  const banners = useClientRecord(ClientStateKey.DismissedBanners);
  const { track } = useTrack(AnalyticsEvent.BannerDismiss);

  const dismiss = () => {
    banners.set(id, value);
    track({ id, value });
  };

  return {
    dismiss,
    isDismissed: banners.entry(id).pipe(
      map((dismissed) => dismissed === value),
    ),
  };
}
