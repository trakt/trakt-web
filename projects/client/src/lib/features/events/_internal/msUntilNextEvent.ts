import { assertDefined } from '../../../utils/assert/assertDefined.ts';
import type { EventConfig } from '../models/EventConfig.ts';
import type { EventDateFn } from '../models/EventDateFn.ts';
import type { Events } from '../models/Events.ts';

type UntilNextEventProps = {
  events: Events;
  dateFn: EventDateFn;
  now: Date;
};

/**
 * Return milliseconds until the next transition (start or end+1s), or null if no upcoming transition.
 * Caller should clamp to setTimeout limits.
 */
function msUntilNextTransition(
  now: Date,
  dateFn: EventDateFn,
  cfg: EventConfig,
): number | null {
  const start = dateFn(cfg.start).getTime();
  const end = dateFn(cfg.end).getTime();
  const time = now.getTime();

  if (time < start) return start - time;
  if (time >= start && time <= end) return end - time + 1000;
  return null;
}

/**
 * Return the milliseconds until the next transition for any known scope, or null if none.
 * This is the minimum positive msUntilNextTransition across all scopes.
 */
export function msUntilNextEvent(
  { events, now, dateFn }: UntilNextEventProps,
): number | null {
  const times = Object.keys(events)
    .map((k) =>
      msUntilNextTransition(
        now,
        dateFn,
        assertDefined(events[k], 'Event config not found'),
      )
    )
    .filter((v): v is number => typeof v === 'number' && v > 0);

  if (times.length === 0) return null;
  return Math.min(...times);
}
