import { assertDefined } from '../../../utils/assert/assertDefined.ts';
import type { EventConfig } from '../models/EventConfig.ts';
import type { EventDateFn } from '../models/EventDateFn.ts';
import type { Events } from '../models/Events.ts';

type ActiveEventProps = {
  events: Events;
  dateFn: EventDateFn;
  now: Date;
};

function isDateInScope(
  now: Date,
  cfg: EventConfig,
  dateFn: EventDateFn,
): boolean {
  const start = dateFn(cfg.start);
  const end = dateFn(cfg.end);
  return now >= start && now <= end;
}

/**
 * Return an array of active scope ids at the given time. Order is the insertion order of SCOPES keys.
 */
export function activeEvent(
  { events, now, dateFn }: ActiveEventProps,
): string[] {
  return Object.keys(events).filter((k) =>
    isDateInScope(
      now,
      assertDefined(events[k], 'Event config not found'),
      dateFn,
    )
  );
}
