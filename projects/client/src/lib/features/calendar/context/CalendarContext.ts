import type { BehaviorSubject } from 'rxjs';
import type { ActiveDate } from './ActiveDate.ts';

export type CalendarContext = {
  startDate: BehaviorSubject<Date>;
  activeDate: BehaviorSubject<ActiveDate>;
};
