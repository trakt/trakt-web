import type { Snippet } from 'svelte';
import type { CalendarOrder } from '../../models/CalendarOrder.ts';
import type { CalendarPeriod } from '../../models/CalendarLayoutProps.ts';
import type { CalendarView } from './CalendarView.ts';

export type CalendarBoardLayoutProps<T> = {
  activeDate: Date;
  isLoading: boolean;
  item: Snippet<[T]>;
  layout?: 'list' | 'grid';
  order?: CalendarOrder;
  view?: CalendarView;
  periods: ReadonlyArray<CalendarPeriod<T>>;
  onLoadMore: () => void;
};
