import { DRAWER_VIEW_PARAM } from '$lib/components/drawer/constants/index.ts';
import { drawerNavigation } from '$lib/components/drawer/drawerNavigation.ts';

export enum SummaryDrawers {
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
    case SummaryDrawers.Sentiment:
      return SummaryDrawers.Sentiment;
    case SummaryDrawers.Details:
      return SummaryDrawers.Details;
    case SummaryDrawers.Cast:
      return SummaryDrawers.Cast;
    case SummaryDrawers.Videos:
      return SummaryDrawers.Videos;
    case SummaryDrawers.Trivia:
      return SummaryDrawers.Trivia;
    case SummaryDrawers.History:
      return SummaryDrawers.History;
    case SummaryDrawers.WhereToWatch:
      return SummaryDrawers.WhereToWatch;
    case SummaryDrawers.Seasons:
      return SummaryDrawers.Seasons;
    default:
      return null;
  }
}

export function summaryDrawerNavigation(searchParams?: URLSearchParams) {
  const drawer = mapToDrawer(searchParams?.get(DRAWER_VIEW_PARAM));

  return {
    drawer,
    ...drawerNavigation<SummaryDrawers>(),
  };
}
