import { activeEvent } from './_internal/activeEvent.ts';
import { msUntilNextEvent } from './_internal/msUntilNextEvent.ts';
import type { EventDateFn } from './models/EventDateFn.ts';
import type { Events } from './models/Events.ts';

type InitializeEventsProps = {
  setEvent: (id: string | null) => void;
  events: Events;
  dateFn: EventDateFn;
};

function checkAndSchedule({ events, dateFn, setEvent }: InitializeEventsProps) {
  const now = new Date();
  const eventProps = { events, now, dateFn };
  const active = activeEvent(eventProps);

  const id = active.at(0) ?? null;
  setEvent(id);

  const ms = msUntilNextEvent(eventProps);

  if (ms !== null && ms > 0) {
    const clamp = Math.min(ms, 2147483647);
    setTimeout(() => checkAndSchedule({ events, dateFn, setEvent }), clamp);
  }
}

/**
 * Generic initializer that activates the first matching scope (by SCOPES insertion order)
 * and schedules re-checks for the next transition across all scopes.
 */
export function initializeEvents(props: InitializeEventsProps) {
  checkAndSchedule(props);
}
