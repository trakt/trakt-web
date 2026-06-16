import { DRAWER_VIEW_PARAM } from '$lib/components/drawer/constants/index.ts';
import { drawerNavigation } from '$lib/components/drawer/drawerNavigation.ts';

export enum SummaryDrawers {
  Sentiment = 'sentiment',
  Details = 'details',
  Cast = 'cast',
  Videos = 'videos',
  Trivia = 'trivia',
  History = 'history',
  Social = 'social',
  WhereToWatch = 'where-to-watch',
  Seasons = 'seasons',
  Notes = 'notes',
  Comments = 'comments',
  Review = 'review',
  Ratings = 'ratings',
}

const commentIdParam = 'comment_id';

const summaryDrawerParams = {
  [SummaryDrawers.Comments]: { [commentIdParam]: '' },
  [SummaryDrawers.Review]: { [commentIdParam]: '' },
} satisfies Partial<Record<SummaryDrawers, Record<string, string>>>;

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
    case SummaryDrawers.Social:
      return SummaryDrawers.Social;
    case SummaryDrawers.WhereToWatch:
      return SummaryDrawers.WhereToWatch;
    case SummaryDrawers.Seasons:
      return SummaryDrawers.Seasons;
    case SummaryDrawers.Notes:
      return SummaryDrawers.Notes;
    case SummaryDrawers.Comments:
      return SummaryDrawers.Comments;
    case SummaryDrawers.Review:
      return SummaryDrawers.Review;
    case SummaryDrawers.Ratings:
      return SummaryDrawers.Ratings;
    default:
      return null;
  }
}

export function summaryDrawerNavigation(searchParams?: URLSearchParams) {
  const { buildDrawerLink, close } = drawerNavigation(summaryDrawerParams);
  const drawer = mapToDrawer(searchParams?.get(DRAWER_VIEW_PARAM));
  const commentId = searchParams?.get(commentIdParam);
  const sourceCommentId = commentId != null ? Number(commentId) : undefined;

  return {
    drawer,
    sourceCommentId,
    close,
    buildDrawerLink,
    buildCommentsDrawerLink: (id?: number) =>
      buildDrawerLink(
        SummaryDrawers.Comments,
        id != null ? { [commentIdParam]: String(id) } : undefined,
      ),
    buildReviewDrawerLink: (id: number) =>
      buildDrawerLink(
        SummaryDrawers.Review,
        { [commentIdParam]: String(id) },
      ),
  };
}
