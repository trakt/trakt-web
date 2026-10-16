import type { NavigationType } from '@sveltejs/kit';
import type { TodayOpenSource } from '../models/TodayOpenSource.ts';

const OVERVIEW_ROUTE_ID = '/today';

type ToOpenSourceParams = {
  navigationType: NavigationType;
  routeId: string | Nil;
};

export function toOpenSource(
  { navigationType, routeId }: ToOpenSourceParams,
): TodayOpenSource {
  if (navigationType !== 'link') return 'link';

  return routeId === OVERVIEW_ROUTE_ID ? 'overview' : 'navbar';
}
