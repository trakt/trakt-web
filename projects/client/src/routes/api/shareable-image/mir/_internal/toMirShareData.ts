import type { MirShareData } from '$lib/features/share/models/MirShareData.ts';
import type { MirShareItem } from '$lib/features/share/models/MirShareItem.ts';
import type { UserProfile } from '$lib/requests/models/UserProfile.ts';
import type {
  YirDetail,
  YirMostWatchedItem,
  YirWatchedItem,
} from '$lib/requests/models/YirDetail.ts';
import { resolvePosterSource } from '../../_internal/resolvePosterSource.ts';
import { toShareUser } from '../../_internal/toShareUser.ts';

const TOP_COUNT = 3;

type ToMirShareDataProps = {
  detail: YirDetail;
  profile: UserProfile;
  year: number;
  month: number;
};

function toItem({ entry, plays, minutes }: YirMostWatchedItem): MirShareItem {
  return {
    key: entry.key,
    title: entry.title,
    year: entry.year,
    posterUrl: resolvePosterSource(entry.poster.url.medium),
    plays,
    minutes,
  };
}

function toHighlight(item: YirWatchedItem | Nil) {
  if (!item) return null;

  return {
    key: item.entry.key,
    title: item.entry.title,
    posterUrl: resolvePosterSource(item.entry.poster.url.medium),
  };
}

export function toMirShareData({
  detail,
  profile,
  year,
  month,
}: ToMirShareDataProps): MirShareData {
  const { stats, mostWatched } = detail;
  const top = mostWatched.shows.at(0) ?? mostWatched.movies.at(0);

  return {
    year,
    month,
    user: toShareUser(profile),
    colors: top?.entry.colors,
    totals: {
      plays: stats.all.playCounts.total,
      minutes: stats.all.minutes.total,
      episodes: stats.shows.playCounts.total,
      movies: stats.movies.playCounts.total,
    },
    firstWatched: toHighlight(detail.firstWatched),
    lastWatched: toHighlight(detail.lastWatched),
    shows: mostWatched.shows.slice(0, TOP_COUNT).map(toItem),
    movies: mostWatched.movies.slice(0, TOP_COUNT).map(toItem),
  };
}
