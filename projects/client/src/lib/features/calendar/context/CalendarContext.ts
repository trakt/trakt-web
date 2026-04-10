import type { BehaviorSubject } from 'rxjs';

export type CalendarContext = {
  startDate: BehaviorSubject<Date>;
  activeDate: BehaviorSubject<Date>;
  visibleDate: BehaviorSubject<Date | null>;
};
