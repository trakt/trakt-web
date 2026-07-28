import { AnalyticsEvent } from '../events/AnalyticsEvent.ts';

const KNOWN_EVENTS: ReadonlySet<string> = new Set(
  Object.values(AnalyticsEvent),
);

// HAL rejects an entire batch on a single unknown name, so an event whose name
// predates the worker's allowlist would take its neighbours down with it.
// Dropping it here costs one event instead of fifty.
export function isKnownAnalyticsEvent(key: string): boolean {
  return KNOWN_EVENTS.has(key);
}
