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
  Episode = 'episode',
  Notes = 'notes',
  Comments = 'comments',
  Review = 'review',
  Ratings = 'ratings',
  Rewatching = 'rewatching',
}

const commentIdParam = 'comment_id';
const episodeParam = 'episode';
const seasonParam = 'season';

const summaryDrawerParams = {
  [SummaryDrawers.Comments]: { [commentIdParam]: '' },
  [SummaryDrawers.Review]: { [commentIdParam]: '' },
  [SummaryDrawers.Episode]: { [episodeParam]: '' },
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
    case SummaryDrawers.Episode:
      return SummaryDrawers.Episode;
    case SummaryDrawers.Notes:
      return SummaryDrawers.Notes;
    case SummaryDrawers.Comments:
      return SummaryDrawers.Comments;
    case SummaryDrawers.Review:
      return SummaryDrawers.Review;
    case SummaryDrawers.Ratings:
      return SummaryDrawers.Ratings;
    case SummaryDrawers.Rewatching:
      return SummaryDrawers.Rewatching;
    default:
      return null;
  }
}

export function summaryDrawerNavigation(searchParams?: URLSearchParams) {
  const { buildDrawerLink, close } = drawerNavigation(summaryDrawerParams);
  const drawer = mapToDrawer(searchParams?.get(DRAWER_VIEW_PARAM));
  const commentId = searchParams?.get(commentIdParam);
  const sourceCommentId = commentId != null ? Number(commentId) : undefined;
  const episodeNumber = searchParams?.get(episodeParam);
  const sourceEpisode = episodeNumber != null
    ? Number(episodeNumber)
    : undefined;

  return {
    drawer,
    sourceCommentId,
    sourceEpisode,
    close,
    buildDrawerLink,
    buildEpisodeDrawerLink: (
      { season, episode }: { season: number; episode: number },
    ) => {
      const link = buildDrawerLink(
        SummaryDrawers.Episode,
        { [episodeParam]: String(episode) },
      );
      const url = new URL(link.href);
      url.searchParams.set(seasonParam, String(season));
      return { ...link, href: url.toString() };
    },
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
