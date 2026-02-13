import { goto } from '$app/navigation';
import { page } from '$app/state';

const VIEW_PARAM = 'view';

export enum Drawers {
  Sentiment = 'sentiment',
}

function mapToDrawer(value: string | Nil) {
  switch (value) {
    case Drawers.Sentiment:
      return Drawers.Sentiment;
    default:
      return null;
  }
}

export function summaryDrawerNavigation(searchParams?: URLSearchParams) {
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
