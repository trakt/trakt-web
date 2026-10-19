import type { BehaviorSubject } from 'rxjs';
import type { CalendarWindow } from '../models/CalendarWindow.ts';

export type CalendarContext = {
  range: BehaviorSubject<CalendarWindow>;
  activeDate: BehaviorSubject<Date>;
  visibleDate: BehaviorSubject<Date | null>;
};
