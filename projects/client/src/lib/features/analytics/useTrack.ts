import type { AnalyticsData } from '$lib/features/analytics/AnalyticsData.ts';
import { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import { useAnalytics } from '$lib/features/analytics/useAnalytics.ts';
import { useAuth } from '$lib/features/auth/stores/useAuth.ts';
import { useUser } from '$lib/features/auth/stores/useUser.ts';
import { get } from 'svelte/store';

/** TODO: define TrackMap to correlate data contracts with action keys */
export function useTrack(key: AnalyticsEvent, data: AnalyticsData) {
  const { isAuthorized } = useAuth();
  const { current } = useUser();
  const { record, setUser } = useAnalytics();

  function track() {
    const userId = get(isAuthorized) ? current().id.toString() : null;
    setUser(userId);
    record(key, data);
  }

  return { track };
}
