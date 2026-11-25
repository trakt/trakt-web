import { lastPointerStore } from '$lib/features/onboarding/_internal/lastPointerStore.ts';
import type { LastPointer } from '$lib/features/onboarding/models/LastPointer.ts';

const RECENT_MS = 4000;

export function getRecentPointer(now = performance.now()): LastPointer | null {
  const last = lastPointerStore.get();
  if (!last) return null;
  return now - last.at <= RECENT_MS ? last : null;
}
