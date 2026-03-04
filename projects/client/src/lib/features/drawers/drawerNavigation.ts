import { goto } from '$app/navigation';
import { page } from '$app/state';

const VIEW_PARAM = 'view';

export enum Drawers {
  Sentiment = 'sentiment',
  History = 'history',
  Activity = 'activity',
  Calendar = 'calendar',
}

function mapToDrawer(value: string | Nil) {
  switch (value) {
    case Drawers.Sentiment:
      return Drawers.Sentiment;
    case Drawers.History:
      return Drawers.History;
    case Drawers.Activity:
      return Drawers.Activity;
    case Drawers.Calendar:
      return Drawers.Calendar;
    default:
      return null;
  }
}

export function drawerNavigation(searchParams?: URLSearchParams) {
  const drawer = mapToDrawer(searchParams?.get(VIEW_PARAM));

  const buildDrawerLink = (drawer: Drawers) => {
    const url = new URL(page.url);
    url.searchParams.set(VIEW_PARAM, drawer);
    return url.toString();
  };

  const close = () => {
    const url = new URL(page.url);
    url.searchParams.delete(VIEW_PARAM);
    goto(url, { noScroll: true });
  };

  return {
    drawer,
    buildDrawerLink,
    close,
  };
}
