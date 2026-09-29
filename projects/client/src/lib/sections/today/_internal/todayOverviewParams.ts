import { goto } from '$app/navigation';
import { page } from '$app/state';
import { TodayGroupingSchema } from '../models/TodayGrouping.ts';

const GROUPING_PARAM = 'group';
const DAY_PARAM = 'day';

function replaceParam(key: string, value: string) {
  const url = new URL(page.url);
  url.searchParams.set(key, value);
  // eslint-disable-next-line svelte/no-navigation-without-resolve -- resolve() only maps route ids; this replaces the query of the current page
  goto(url, { replaceState: true, noScroll: true, keepFocus: true });
}

export function todayOverviewParams(searchParams: URLSearchParams) {
  return {
    grouping: TodayGroupingSchema.catch('title').parse(
      searchParams.get(GROUPING_PARAM),
    ),
    day: searchParams.get(DAY_PARAM),
    setDay: (value: string) => replaceParam(DAY_PARAM, value),
    setGrouping: (value: string) => replaceParam(GROUPING_PARAM, value),
  };
}
