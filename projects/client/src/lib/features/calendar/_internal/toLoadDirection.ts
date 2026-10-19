import type { CalendarOrder } from '../models/CalendarOrder.ts';

type LoadEdge = 'more' | 'previous';

export function toLoadDirection(order: CalendarOrder, edge: LoadEdge) {
  const isChronological = order === 'chronological';
  const isMore = edge === 'more';

  return isChronological === isMore ? 'later' : 'earlier';
}
