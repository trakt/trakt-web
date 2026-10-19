import type { Observable } from 'rxjs';
import type { Calendar } from './Calendar.ts';

export type CalendarChunkResult<T> = {
  isLoading: Observable<boolean>;
  calendar: Observable<Calendar<T>>;
  hasUpstreamItems: Observable<boolean>;
};
