import type { Calendar } from './Calendar.ts';

export type CalendarPeriod<T = unknown> = {
  key: string;
  calendar: Calendar<T>;
};
