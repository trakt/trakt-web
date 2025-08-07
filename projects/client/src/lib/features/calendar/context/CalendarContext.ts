import type { Writable } from 'svelte/store';
import type { ActiveDate } from './ActiveDate.ts';

export type CalendarContext = {
  startDate: Writable<Date>;
  activeDate: Writable<ActiveDate>;
};
