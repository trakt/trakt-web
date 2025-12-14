import { useAnalytics } from '$lib/features/analytics/useAnalytics.ts';
import { useUser } from '$lib/features/auth/stores/useUser.ts';
import { firstValueFrom } from 'rxjs';
import { getUserAnalyticsData } from './_internal/getUserAnalyticsData.ts';
import type { AnalyticsEventDataMap } from './events/AnalyticsEventDataMap.ts';

export function useTrack<T extends keyof AnalyticsEventDataMap>(key: T) {
  const { user } = useUser();

  const { record, setUser } = useAnalytics();

  async function track<D extends AnalyticsEventDataMap[T]>(
    ...args: [D] extends [never] ? [] | [D?] : [D]
  ) {
    const currentUser = await firstValueFrom(user);
    const userId = currentUser?.id.toString() ?? null;
    setUser(userId);

    const userData = getUserAnalyticsData(currentUser);
    const eventData = {
      ...(args[0] ?? {}),
      ...userData,
    };
    record(key, eventData);
  }

  return { track };
}
