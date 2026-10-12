import { ClientStateKey } from '$lib/features/client-state/models/ClientStateKey.ts';
import { useClientRecord } from '$lib/features/client-state/useClientRecord.ts';

export function useTodaySeenStories() {
  const stories = useClientRecord(ClientStateKey.TodaySeenStories);

  return {
    seenStories: stories.entries,
    markSeen: (key: string) => stories.set(key, Date.now()),
  };
}
