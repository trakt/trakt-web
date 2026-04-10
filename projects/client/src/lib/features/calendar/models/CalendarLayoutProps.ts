import type { Snippet } from 'svelte';
import type { Calendar } from './Calendar.ts';
import type { CalendarNavigationProps } from './CalendarNavigationProps.ts';
import type { CalendarOrder } from './CalendarOrder.ts';

export type CalendarPeriod<T = unknown> = {
  key: string;
  calendar: Calendar<T>;
};

export type CalendarLayoutProps<T> = {
  isLoading: boolean;
  item: Snippet<[T]>;
  layout?: 'list' | 'grid';
  order?: CalendarOrder;
  periods: ReadonlyArray<CalendarPeriod<T>>;
  onLoadMore: () => void;
} & CalendarNavigationProps;
