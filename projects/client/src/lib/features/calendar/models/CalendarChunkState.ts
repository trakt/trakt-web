import type { Calendar } from './Calendar.ts';

export type CalendarChunkState<T> = {
  isLoading: boolean;
  calendar: Calendar<T> | null;
  hasUpstreamItems: boolean;
};
