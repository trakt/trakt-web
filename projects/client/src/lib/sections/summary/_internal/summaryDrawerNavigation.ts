import { DRAWER_VIEW_PARAM } from '$lib/components/drawer/constants/index.ts';
import { drawerNavigation } from '$lib/components/drawer/drawerNavigation.ts';

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
  const drawer = mapToDrawer(searchParams?.get(DRAWER_VIEW_PARAM));

  return {
    drawer,
    ...drawerNavigation<Drawers>(),
  };
}
