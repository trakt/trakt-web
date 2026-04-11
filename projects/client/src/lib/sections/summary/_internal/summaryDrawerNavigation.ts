import { goto } from '$app/navigation';
import { page } from '$app/state';

const VIEW_PARAM = 'view';

export enum Drawers {
  Sentiment = 'sentiment',
  Details = 'details',
  Cast = 'cast',
  Videos = 'videos',
  Trivia = 'trivia',
  History = 'history',
  WhereToWatch = 'where-to-watch',
  Seasons = 'seasons',
}

function mapToDrawer(value: string | Nil) {
  switch (value) {
    case Drawers.Sentiment:
      return Drawers.Sentiment;
    case Drawers.Details:
      return Drawers.Details;
    case Drawers.Cast:
      return Drawers.Cast;
    case Drawers.Videos:
      return Drawers.Videos;
    case Drawers.Trivia:
      return Drawers.Trivia;
    case Drawers.History:
      return Drawers.History;
    case Drawers.WhereToWatch:
      return Drawers.WhereToWatch;
    case Drawers.Seasons:
      return Drawers.Seasons;
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
