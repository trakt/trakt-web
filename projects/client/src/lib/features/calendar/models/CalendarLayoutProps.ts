import type { Snippet } from 'svelte';
import type { Calendar } from './Calendar.ts';
import type { CalendarNavigationProps } from './CalendarNavigationProps.ts';
import type { CalendarOrder } from './CalendarOrder.ts';

export type CalendarLayoutProps<T> = {
  calendar: Calendar<T>;
  isLoading: boolean;
  item: Snippet<[T]>;
  layout?: 'list' | 'grid';
  empty?: Snippet;
  order?: CalendarOrder;
} & CalendarNavigationProps;
