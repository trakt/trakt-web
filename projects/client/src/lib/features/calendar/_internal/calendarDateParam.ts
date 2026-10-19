import { browser } from '$app/environment';
import { replaceState } from '$app/navigation';
import { page } from '$app/state';
import { parseCalendarDate } from './parseCalendarDate.ts';

const DATE_PARAM = 'date';

function currentSearchParams() {
  return browser
    ? new URL(globalThis.location.href).searchParams
    : page.url.searchParams;
}

export function calendarDateParam() {
  return {
    date: parseCalendarDate(currentSearchParams().get(DATE_PARAM)),
    setDate: (value: string | null) => {
      if (currentSearchParams().get(DATE_PARAM) === value) return;

      const url = new URL(globalThis.location.href);
      if (value) url.searchParams.set(DATE_PARAM, value);
      else url.searchParams.delete(DATE_PARAM);

      // eslint-disable-next-line svelte/no-navigation-without-resolve
      replaceState(url, page.state);
    },
  };
}
