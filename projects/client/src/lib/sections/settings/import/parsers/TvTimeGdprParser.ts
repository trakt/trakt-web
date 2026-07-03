import type { UniversalImportItem } from '../ImportTypes.ts';
import type { FileParser } from './ParserInterface.ts';
import { parseCsvText } from './utils/parseCsvText.ts';
import { toISOString } from './utils/toISOString.ts';
import { unzipCsvTexts } from './utils/unzipCsvTexts.ts';

type TrackingV1Row = {
  uuid?: string;
  type?: string;
  entity_type?: string;
  series_name?: string;
  movie_name?: string;
  release_date?: string;
  alpha_range_key?: string;
  season_number?: string;
  episode_number?: string;
  episode_id?: string;
  watch_date_range_key?: string;
  created_at?: string;
};

type TrackingV2Row = {
  key?: string;
  created_at?: string;
  s_id?: string;
  series_name?: string;
  season_number?: string;
  episode_number?: string;
  episode_id?: string;
  is_followed?: string;
  is_for_later?: string;
  is_archived?: string;
};

type FollowedShowRow = {
  tv_show_id?: string;
  tv_show_name?: string;
  archived?: string;
};

type RatingVoteRow = {
  uuid?: string;
  episode_id?: string;
  movie_name?: string;
  vote_key?: string;
};

const TRACKING_V1_MARKER = 'type-uuid-n';
const TRACKING_V2_MARKER = 'ep_id';
const FOLLOWED_SHOW_MARKER = 'notification_offset';

// emotions-live-votes.csv shares this header, so rating votes are routed
// by file name instead of a column marker.
const RATINGS_CSV = 'ratings-live-votes.csv';

// TV Time's stars_wording_scalev2 rating set: id -> star position, doubled
// to Trakt's 1-10 scale. Stable since 2018 and frozen by the July 2026
// shutdown; verified against msapi.tvtime.com/live/v1/ratings/sets.
const RATING_ID_TO_SCORE: Record<number, number> = {
  1: 2, // bad
  27: 4, // ok
  28: 6, // good
  29: 8, // great
  3: 10, // wow
};

function toInt(value?: string): number | undefined {
  if (!value) return undefined;
  const n = parseInt(value, 10);
  return isNaN(n) ? undefined : n;
}

// TV Time stores unknown release dates as the Go zero time (0001-01-01).
function toYear(releaseDate?: string): number | undefined {
  const year = toInt(releaseDate?.slice(0, 4));
  return year != null && year >= 1888 ? year : undefined;
}

// TV Time slugs are English regardless of the localized movie_name,
// so they match Trakt titles better (e.g. 승리호 -> "space sweepers").
function toMovieTitle(row: TrackingV1Row): string | undefined {
  const slug = row.alpha_range_key?.replace(`${row.type}-alpha-`, '');
  const title = slug?.replaceAll('-', ' ').trim();
  return title || row.movie_name || undefined;
}

function toWatchedAt(row: TrackingV1Row): string | undefined {
  const [, epoch] = row.watch_date_range_key?.match(/watch-date-(\d+)/) ?? [];
  if (epoch) return new Date(Number(epoch) * 1000).toISOString();
  return toISOString(row.created_at);
}

// Year-less movies (TV Time zero release dates) are kept: the sync
// engine resolves their ids via search before building payloads.
function parseV1Movie(row: TrackingV1Row): UniversalImportItem | null {
  const title = toMovieTitle(row);
  if (!title) return null;

  const base = {
    type: 'movie' as const,
    ids: {},
    title,
    year: toYear(row.release_date),
  };

  if (row.type === 'watch') {
    return { ...base, action: 'history', watched_at: toWatchedAt(row) };
  }

  if (row.type === 'towatch') {
    return { ...base, action: 'watchlist' };
  }

  return null;
}

function parseV1Episode(row: TrackingV1Row): UniversalImportItem | null {
  if (row.type !== 'watch') return null;

  const tvdbId = toInt(row.episode_id);
  if (tvdbId == null) return null;

  return {
    action: 'history',
    type: 'episode',
    ids: { tvdb: tvdbId },
    title: row.series_name || undefined,
    season: toInt(row.season_number),
    episode: toInt(row.episode_number),
    watched_at: toWatchedAt(row),
  };
}

function parseV2Episode(row: TrackingV2Row): UniversalImportItem | null {
  if (!row.key?.startsWith('watch-episode-')) return null;

  const tvdbId = toInt(row.episode_id);
  if (tvdbId == null) return null;

  return {
    action: 'history',
    type: 'episode',
    ids: { tvdb: tvdbId },
    title: row.series_name || undefined,
    season: toInt(row.season_number),
    episode: toInt(row.episode_number),
    watched_at: toISOString(row.created_at),
  };
}

function parseV2ShowWatchlist(
  rows: TrackingV2Row[],
  watchedShowIds: ReadonlySet<number>,
): UniversalImportItem[] {
  return rows
    .filter((row) => row.key?.startsWith('user-series-'))
    .filter((row) => row.is_archived !== 'true')
    .filter((row) =>
      row.is_for_later === 'true' ||
      (row.is_followed === 'true' &&
        !watchedShowIds.has(toInt(row.s_id) ?? -1))
    )
    .flatMap((row) => {
      const tvdbId = toInt(row.s_id);
      if (tvdbId == null) return [];

      return [{
        action: 'watchlist' as const,
        type: 'show' as const,
        ids: { tvdb: tvdbId },
        title: row.series_name || undefined,
      }];
    });
}

// The v2 tracking flags miss follows that predate them, so
// followed_tv_show.csv backfills the rest of the watchlist.
function parseFollowedShowWatchlist(
  rows: FollowedShowRow[],
  watchedShowIds: ReadonlySet<number>,
  seenShowIds: ReadonlySet<number>,
): UniversalImportItem[] {
  return rows
    .filter((row) => row.archived !== '1')
    .flatMap((row) => {
      const tvdbId = toInt(row.tv_show_id);
      if (tvdbId == null) return [];
      if (watchedShowIds.has(tvdbId) || seenShowIds.has(tvdbId)) return [];

      return [{
        action: 'watchlist' as const,
        type: 'show' as const,
        ids: { tvdb: tvdbId },
        title: row.tv_show_name || undefined,
      }];
    });
}

// Vote rows only carry the localized movie_name; joining on uuid against
// the v1 tracking rows recovers the English slug and release year.
function parseRatingVotes(
  ratingRows: RatingVoteRow[],
  v1Rows: TrackingV1Row[],
): UniversalImportItem[] {
  const moviesByUuid = new Map(
    v1Rows
      .filter((row) => row.entity_type === 'movie' && row.uuid)
      .map((row) => [row.uuid, row]),
  );

  const byUuid = new Map<string, UniversalImportItem>();

  for (const row of ratingRows) {
    if (!row.uuid) continue;
    // Episode ratings are skipped: the ratings sync payload only carries
    // movies and shows.
    if (row.episode_id && row.episode_id !== '0') continue;

    const ratingId = toInt(row.vote_key?.split('-').at(-1));
    const rating = ratingId != null ? RATING_ID_TO_SCORE[ratingId] : undefined;
    if (rating == null) continue;

    const tracked = moviesByUuid.get(row.uuid);
    const title = tracked ? toMovieTitle(tracked) : row.movie_name || undefined;
    if (!title) continue;

    byUuid.set(row.uuid, {
      action: 'ratings',
      type: 'movie',
      ids: {},
      title,
      year: toYear(tracked?.release_date),
      rating,
    });
  }

  return [...byUuid.values()];
}

function parseGdprRows(
  { v1Rows, v2Rows, followedRows, ratingRows }: {
    v1Rows: TrackingV1Row[];
    v2Rows: TrackingV2Row[];
    followedRows: FollowedShowRow[];
    ratingRows: RatingVoteRow[];
  },
): UniversalImportItem[] {
  const episodes = v2Rows.length > 0
    ? v2Rows
      .map(parseV2Episode)
      .filter((item): item is UniversalImportItem => item !== null)
    : v1Rows
      .filter((row) => row.entity_type === 'episode')
      .map(parseV1Episode)
      .filter((item): item is UniversalImportItem => item !== null);

  const movies = v1Rows
    .filter((row) => row.entity_type === 'movie')
    .map(parseV1Movie)
    .filter((item): item is UniversalImportItem => item !== null);

  const watchedShowIds = new Set(
    v2Rows
      .filter((row) => row.key?.startsWith('watch-episode-'))
      .map((row) => toInt(row.s_id))
      .filter((id): id is number => id != null),
  );

  const showWatchlist = parseV2ShowWatchlist(v2Rows, watchedShowIds);
  const watchlistedShowIds = new Set(
    showWatchlist
      .map((item) => item.ids.tvdb)
      .filter((id): id is number => id != null),
  );
  const followedWatchlist = parseFollowedShowWatchlist(
    followedRows,
    watchedShowIds,
    watchlistedShowIds,
  );

  const ratings = parseRatingVotes(ratingRows, v1Rows);

  return [
    ...episodes,
    ...movies,
    ...showWatchlist,
    ...followedWatchlist,
    ...ratings,
  ];
}

function isV1Row(row: Record<string, unknown>): boolean {
  return TRACKING_V1_MARKER in row;
}

function isV2Row(row: Record<string, unknown>): boolean {
  return TRACKING_V2_MARKER in row;
}

function isFollowedShowRow(row: Record<string, unknown>): boolean {
  return FOLLOWED_SHOW_MARKER in row;
}

function unzipGdprCsvTexts(buffer: ArrayBuffer) {
  const isGdprCsv = (basename: string) =>
    (basename.startsWith('tracking-prod-records') &&
      basename.endsWith('.csv')) ||
    basename === 'followed_tv_show.csv' ||
    basename === RATINGS_CSV;

  try {
    return unzipCsvTexts({ buffer, isMatch: isGdprCsv });
  } catch {
    throw new Error(
      'Could not read the .zip file. If it is password protected, extract it first and upload the tracking-prod-records CSV files instead.',
    );
  }
}

async function collectCsvTexts(files: ReadonlyArray<File>) {
  const entries = await Promise.all(files.map(async (file) => {
    if (file.name.endsWith('.zip')) {
      return unzipGdprCsvTexts(await file.arrayBuffer());
    }
    return [{ basename: file.name, text: await file.text() }];
  }));

  return entries.flat();
}

export const TvTimeGdprParser: FileParser = {
  name: 'TV Time GDPR',

  canParse(files) {
    return files.length > 0 &&
      files.every(
        (file) => file.name.endsWith('.csv') || file.name.endsWith('.zip'),
      );
  },

  async parse(files) {
    const entries = await collectCsvTexts(files);
    const parsed = await Promise.all(
      entries.map(async (entry) => ({
        basename: entry.basename,
        rows: await parseCsvText(entry.text) as Record<string, unknown>[],
      })),
    );

    const v1Rows: TrackingV1Row[] = [];
    const v2Rows: TrackingV2Row[] = [];
    const followedRows: FollowedShowRow[] = [];
    const ratingRows: RatingVoteRow[] = [];

    for (const { basename, rows } of parsed) {
      const [first] = rows;
      if (!first) continue;
      if (basename === RATINGS_CSV) {
        ratingRows.push(...(rows as RatingVoteRow[]));
      } else if (isV2Row(first)) v2Rows.push(...(rows as TrackingV2Row[]));
      else if (isV1Row(first)) v1Rows.push(...(rows as TrackingV1Row[]));
      else if (isFollowedShowRow(first)) {
        followedRows.push(...(rows as FollowedShowRow[]));
      }
    }

    return parseGdprRows({ v1Rows, v2Rows, followedRows, ratingRows });
  },
};
