import type { Snippet } from 'svelte';
import type { CalendarChunkResult } from './CalendarChunkResult.ts';

export type HistoryCalendarProps<T> = {
  useSource: (params: { start: Date; days: number }) => CalendarChunkResult<T>;
  sourceKey: string;
  item: Snippet<[T]>;
  layout?: 'list' | 'grid';
  maxDate?: Date;
  minDate?: Date | Nil;
};
