import type {
  YirDetail,
  YirGenresGroup,
  YirStatsCategory,
} from '$lib/requests/models/YirDetail.ts';
import type { MonthReview } from '../models/MonthReview.ts';
import type { MonthReviewPlay } from '../models/MonthReviewPlay.ts';
import type { MonthReviewShare } from '../models/MonthReviewShare.ts';
import type { MonthReviewTitle } from '../models/MonthReviewTitle.ts';
import type { MonthReviewTypeStats } from '../models/MonthReviewTypeStats.ts';
import { toMonthReviewTitle } from './toMonthReviewTitle.ts';

const MAX_SHARES = 6;
const MAX_TOP_RATED = 5;

type ToMonthReviewFromDetailParams = {
  detail: YirDetail;
  previous?: YirDetail | Nil;
};

type Series = ReadonlyArray<number> | Nil;
type WatchedItem = NonNullable<YirDetail['firstWatched']>;
type MostWatchedItem = YirDetail['mostWatched']['shows'][number];

const byCount = (a: MonthReviewShare, b: MonthReviewShare) => b.count - a.count;

function optional<K extends string, V>(
  key: K,
  value: V | Nil,
): Partial<Record<K, V>> {
  return value === undefined || value === null
    ? {}
    : ({ [key]: value } as Record<K, V>);
}

function sumSeries(a: Series, b: Series): ReadonlyArray<number> | undefined {
  if (a && b) return a.map((value, index) => value + (b.at(index) ?? 0));
  return a ?? b ?? undefined;
}

const toTitles = (items: ReadonlyArray<MostWatchedItem>) =>
  [...items]
    .sort((a, b) => b.plays - a.plays)
    .map(({ entry, plays, minutes }) =>
      toMonthReviewTitle({ entry, plays, minutes }),
    );

function toGenres(groups: ReadonlyArray<YirGenresGroup>) {
  const merged = groups
    .flatMap((group) => group.genres)
    .reduce(
      (genres, genre) =>
        genres.set(genre.slug, {
          key: genre.slug,
          label: genre.name,
          count: (genres.get(genre.slug)?.count ?? 0) + genre.count,
        }),
      new Map<string, MonthReviewShare>(),
    );

  return [...merged.values()].sort(byCount);
}

type ToTypeStatsParams = {
  stats: YirStatsCategory;
  mostWatched: ReadonlyArray<MostWatchedItem>;
  genres: YirGenresGroup;
};

function toTypeStats({
  stats,
  mostWatched,
  genres,
}: ToTypeStatsParams): MonthReviewTypeStats {
  const allGenres = toGenres([genres]);

  return {
    plays: stats.playCounts.total,
    minutes: stats.minutes.total,
    items: stats.itemsCount ?? mostWatched.length,
    playsPerDay: stats.playCounts.daily,
    minutesPerDay: stats.minutes.daily,
    titles: toTitles(mostWatched),
    genres: allGenres.slice(0, MAX_SHARES),
    genreCount: allGenres.length,
    ...optional('dailyPlays', stats.distributions?.daily),
    ...optional('hourlyPlays', stats.distributions?.hourly),
  };
}

function toTopRated(detail: YirDetail): ReadonlyArray<MonthReviewTitle> {
  return [...detail.topRated.shows, ...detail.topRated.movies]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, MAX_TOP_RATED)
    .map(({ entry, rating }) =>
      toMonthReviewTitle({ entry, plays: 0, rating }),
    );
}

const toDaily = (detail: YirDetail) =>
  detail.stats.all.distributions?.daily ??
  sumSeries(
    detail.stats.shows.distributions?.daily,
    detail.stats.movies.distributions?.daily,
  );

const countActive = (daily: Series) =>
  daily ? daily.filter((plays) => plays > 0).length : undefined;

function toServices(
  detail: YirDetail,
  previous: YirDetail | Nil,
): ReadonlyArray<MonthReviewShare> {
  const before = new Map(
    (previous?.streamingServices?.services ?? []).map((service) => [
      service.source,
      service.all,
    ]),
  );

  return (detail.streamingServices?.services ?? [])
    .map((service) => ({
      key: service.source,
      label: service.name,
      count: service.all,
      shows: service.shows,
      movies: service.movies,
      ...optional(
        'previous',
        previous ? (before.get(service.source) ?? 0) : null,
      ),
    }))
    .sort(byCount)
    .slice(0, MAX_SHARES);
}

function toPlay(item: WatchedItem | Nil): MonthReviewPlay | undefined {
  if (!item) return undefined;

  const title = toMonthReviewTitle({ entry: item.entry, plays: 1 });

  return item.type === 'episode'
    ? { title, watchedAt: item.watchedAt, episode: item.episode }
    : { title, watchedAt: item.watchedAt };
}

export function toMonthReviewFromDetail({
  detail,
  previous,
}: ToMonthReviewFromDetailParams): MonthReview {
  const { all, shows, movies } = detail.stats;
  const daily = toDaily(detail);
  const weekdays =
    all.distributions?.days ??
    sumSeries(shows.distributions?.days, movies.distributions?.days);
  const hourly =
    all.distributions?.hourly ??
    sumSeries(shows.distributions?.hourly, movies.distributions?.hourly);

  return {
    tier: 'vip',
    plays: all.playCounts.total,
    episodes: shows.playCounts.total,
    movies: movies.itemsCount ?? detail.mostWatched.movies.length,
    shows: shows.itemsCount ?? detail.mostWatched.shows.length,
    titles: toTitles([
      ...detail.mostWatched.shows,
      ...detail.mostWatched.movies,
    ]),
    minutes: all.minutes.total,
    playsPerDay: all.playCounts.daily,
    minutesPerDay: all.minutes.daily,
    ratingsCount: all.ratingsCounts.total,
    commentsCount: all.commentsCounts.total,
    listsCount: all.listsCounts.total,
    topRated: toTopRated(detail),
    genres: toGenres([detail.genres.shows, detail.genres.movies]).slice(
      0,
      MAX_SHARES,
    ),
    services: toServices(detail, previous),
    byType: {
      shows: toTypeStats({
        stats: shows,
        mostWatched: detail.mostWatched.shows,
        genres: detail.genres.shows,
      }),
      movies: toTypeStats({
        stats: movies,
        mostWatched: detail.mostWatched.movies,
        genres: detail.genres.movies,
      }),
    },
    ...optional('activeDays', countActive(daily)),
    ...optional(
      'weekdayPlays',
      weekdays && weekdays.length === 7 ? weekdays : undefined,
    ),
    ...optional('dailyPlays', daily),
    ...optional('hourlyPlays', hourly),
    ...optional('firstPlay', toPlay(detail.firstWatched)),
    ...optional('lastPlay', toPlay(detail.lastWatched)),
    ...optional(
      'previous',
      previous
        ? {
            plays: previous.stats.all.playCounts.total,
            minutes: previous.stats.all.minutes.total,
            minutesPerDay: previous.stats.all.minutes.daily,
            ...optional('activeDays', countActive(toDaily(previous))),
          }
        : undefined,
    ),
  };
}
