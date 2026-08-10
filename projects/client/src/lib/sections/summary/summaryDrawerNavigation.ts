import { DRAWER_VIEW_PARAM } from '$lib/components/drawer/constants/index.ts';
import { drawerNavigation } from '$lib/components/drawer/drawerNavigation.ts';
import { SummaryDrawers } from '$lib/sections/summary/SummaryDrawers.ts';
import {
  COMMENT_ID_PARAM,
  EPISODE_PARAM,
  SEASON_PARAM,
} from '$lib/sections/summary/constants.ts';

const summaryDrawerParams = {
  [SummaryDrawers.Comments]: { [COMMENT_ID_PARAM]: '' },
  [SummaryDrawers.Review]: { [COMMENT_ID_PARAM]: '' },
  [SummaryDrawers.Episode]: { [EPISODE_PARAM]: '', [SEASON_PARAM]: '' },
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
    case SummaryDrawers.Soundtrack:
      return SummaryDrawers.Soundtrack;
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
    case SummaryDrawers.Glance:
      return SummaryDrawers.Glance;
    case SummaryDrawers.Reactions:
      return SummaryDrawers.Reactions;
    default:
      return null;
  }
}

export function summaryDrawerNavigation(searchParams?: URLSearchParams) {
  // `season` is the show page's active-season tab state. The episode drawer
  // sets it on open, but closing must keep it: stripping it flips the page's
  // `currentSeason` to NaN, tearing down and remounting the whole page.
  const { buildDrawerLink, openDrawer, close, closeParams } = drawerNavigation(
    summaryDrawerParams,
    {
      persistentKeys: [SEASON_PARAM],
    },
  );
  const drawer = mapToDrawer(searchParams?.get(DRAWER_VIEW_PARAM));
  const commentId = searchParams?.get(COMMENT_ID_PARAM);
  const parsedCommentId = commentId != null ? Number(commentId) : undefined;
  const sourceCommentId =
    parsedCommentId != null && Number.isFinite(parsedCommentId)
      ? parsedCommentId
      : undefined;
  const episodeNumber = searchParams?.get(EPISODE_PARAM);
  const parsedEpisode = episodeNumber != null
    ? Number(episodeNumber)
    : undefined;
  const sourceEpisode = parsedEpisode != null && !Number.isNaN(parsedEpisode)
    ? parsedEpisode
    : undefined;

  return {
    drawer,
    sourceCommentId,
    sourceEpisode,
    close,
    closeCommentDrawer: () =>
      drawer === SummaryDrawers.Episode
        ? closeParams(COMMENT_ID_PARAM)
        : close(),
    buildDrawerLink,
    buildEpisodeDrawerLink: (
      { season, episode }: { season: number; episode: number },
    ) =>
      buildDrawerLink(
        SummaryDrawers.Episode,
        { [EPISODE_PARAM]: String(episode), [SEASON_PARAM]: String(season) },
      ),
    buildCommentsDrawerLink: (id?: number) =>
      buildDrawerLink(
        SummaryDrawers.Comments,
        id != null ? { [COMMENT_ID_PARAM]: String(id) } : undefined,
      ),
    buildReviewDrawerLink: (id: number) =>
      buildDrawerLink(
        SummaryDrawers.Review,
        { [COMMENT_ID_PARAM]: String(id) },
      ),
    openReviewDrawer: (id: number) =>
      openDrawer(
        SummaryDrawers.Review,
        { [COMMENT_ID_PARAM]: String(id) },
      ),
  };
}
