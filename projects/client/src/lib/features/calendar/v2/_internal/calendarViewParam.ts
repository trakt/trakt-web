import { goto } from '$app/navigation';
import { page } from '$app/state';
import {
  type CalendarView,
  CalendarViewSchema,
} from '../models/CalendarView.ts';

const VIEW_PARAM = 'view';

export function calendarViewParam(searchParams: URLSearchParams) {
  return {
    view: CalendarViewSchema.nullable()
      .catch(null)
      .parse(searchParams.get(VIEW_PARAM)),
    setView: (view: CalendarView) => {
      const url = new URL(page.url);
      url.searchParams.set(VIEW_PARAM, view);
      // eslint-disable-next-line svelte/no-navigation-without-resolve -- resolve() only maps route ids; this replaces the query of the current page
      goto(url, { replaceState: true, noScroll: true, keepFocus: true });
    },
  };
}
