import type { AnalyticsData } from '$lib/features/analytics/AnalyticsData.ts';
import { useAnalytics } from '$lib/features/analytics/useAnalytics.ts';
import { useAuth } from '$lib/features/auth/stores/useAuth.ts';
import { useUser } from '$lib/features/auth/stores/useUser.ts';
import { get } from 'svelte/store';

/** TODO: define TrackMap to correlate data contracts with action keys */
export function useAnalyticsAction(key: string, data: AnalyticsData) {
  const { isAuthorized } = useAuth();
  const { current } = useUser();
  const { record, setUser } = useAnalytics();

  function track() {
    const userId = get(isAuthorized) ? current().id.toString() : null;
    setUser(userId);
    record(key, data);
  }

  function trackOn<K extends keyof HTMLElementEventMap>(
    node: HTMLElement,
    action: K,
  ) {
    node.addEventListener(action, track);

    return {
      destroy() {
        node.removeEventListener(action, track);
      },
    };
  }

  return { trackOn };
}
