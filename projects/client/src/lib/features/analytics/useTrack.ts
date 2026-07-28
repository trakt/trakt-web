import { useAnalytics } from '$lib/features/analytics/useAnalytics.ts';
import type { AnalyticsEventDataMap } from './events/AnalyticsEventDataMap.ts';

export function useTrack<T extends keyof AnalyticsEventDataMap>(key: T) {
  const { record } = useAnalytics();

  function track<D extends AnalyticsEventDataMap[T]>(
    ...args: [D] extends [never] ? [] | [D?] : [D]
  ) {
    record(key, args[0] ?? {});
  }

  return { track };
}
