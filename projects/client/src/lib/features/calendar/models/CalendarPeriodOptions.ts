import type { Observable } from 'rxjs';
import type { CalendarOrder } from './CalendarOrder.ts';

export type CalendarPeriodOptions = {
  order?: CalendarOrder;
  weeksPerStep?: number;
  upperBound?: Date;
  lowerBound?: Date;
  fingerprint?: Observable<string>;
};
