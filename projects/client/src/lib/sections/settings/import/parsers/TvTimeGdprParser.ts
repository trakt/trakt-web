import type { UniversalImportItem } from '../ImportTypes.ts';
import type { FileParser } from './ParserInterface.ts';
import { parseCsvText } from './utils/parseCsvText.ts';
import { toISOString } from './utils/toISOString.ts';
import { toEpisodeIds } from './utils/toEpisodeIds.ts';
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
  s_no?: string;
  ep_no?: string;
  ep_id?: string;
  // Some v2 exports duplicate the episode columns under legacy names; kept as
  // fallbacks so a variant that only populates these still imports.
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

type ListRow = {
  name?: string;
  is_public?: string;
  objects?: string;
};

const TRACKING_V1_MARKER = 'type-uuid-n';
// Every v2 row is identified by its `key` (watch-episode-*, user-series-*,
// tracking-stats) — it's the field the parser branches on. The episode
// columns (ep_id, episode_id, ...) are pruned by TV Time when the account
// has no watch history, so they can't be relied on to detect the format.
const TRACKING_V2_MARKER = 'key';
const FOLLOWED_SHOW_MARKER = 'notification_offset';

// emotions-live-votes.csv shares this header, so rating votes are routed
// by file name instead of a column marker.
const RATINGS_CSV = 'ratings-live-votes.csv';

// Custom lists: one row per list, items embedded in the `objects` column as
// Go-printed maps. Routed by filename.
const LISTS_CSV = 'lists-prod-lists.csv';

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

// First non-empty value — v2 exports vary in which of two column names carry
// the episode fields, and a present-but-blank column must not shadow the other.
function firstOf(...values: (string | undefined)[]): string | undefined {
  return values.find((value) => value != null && value !== '');
}

type GdprBucket = 'v1' | 'v2' | 'followed' | 'rating' | 'list' | null;

// Route a parsed GDPR file to its row bucket: ratings/lists by filename (their
// headers are shared/ambiguous), everything else by the first row's marker.
function classifyGdprFile(
  { basename, rows }: { basename: string; rows: Record<string, unknown>[] },
): GdprBucket {
  const [first] = rows;
  if (!first) return null;
  if (basename === RATINGS_CSV) return 'rating';
  if (basename === LISTS_CSV) return 'list';
  if (isV2Row(first)) return 'v2';
  if (isV1Row(first)) return 'v1';
  if (isFollowedShowRow(first)) return 'followed';
  return null;
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

  // ep_id is the TVDB episode id (verified against the Trakt search API);
  // legacy exports carry it under episode_id. s_id/s_no/ep_no back positional
  // resolution when the episode's own id is absent.
  const showTvdb = toInt(row.s_id);
  const season = toInt(firstOf(row.s_no, row.season_number));
  const episode = toInt(firstOf(row.ep_no, row.episode_number));
  const ids = toEpisodeIds({
    tvdbId: toInt(firstOf(row.ep_id, row.episode_id)),
    showTvdb,
    season,
    episode,
  });
  if (ids == null) return null;

  return {
    action: 'history',
    type: 'episode',
    ids,
    showTvdb,
    title: row.series_name || undefined,
    season,
    episode,
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

// The `objects` column is a Go-printed map array:
// `[map[created_at:.. id:75675 type:series uuid:..] map[.. id:367118 ..]]`.
// Keys print alphabetically, so `id:<n> type:<t>` are always adjacent.
const LIST_OBJECT_RE = /id:(\d+)\s+type:(\w+)/g;

function parseListRows(listRows: ListRow[]): UniversalImportItem[] {
  return listRows.flatMap((row) => {
    const listName = row.name?.trim();
    if (!listName || !row.objects) return [];

    const listIsPublic = row.is_public === 'true';
    return [...row.objects.matchAll(LIST_OBJECT_RE)].flatMap(
      ([, id, type]): UniversalImportItem[] => {
        const tvdbId = toInt(id);
        if (tvdbId == null) return [];
        return [{
          action: 'list',
          type: type === 'movie' ? 'movie' : 'show',
          ids: { tvdb: tvdbId },
          listName,
          listIsPublic,
        }];
      },
    );
  });
}

function parseGdprRows(
  { v1Rows, v2Rows, followedRows, ratingRows, listRows }: {
    v1Rows: TrackingV1Row[];
    v2Rows: TrackingV2Row[];
    followedRows: FollowedShowRow[];
    ratingRows: RatingVoteRow[];
    listRows: ListRow[];
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
  const lists = parseListRows(listRows);

  return [
    ...episodes,
    ...movies,
    ...showWatchlist,
    ...followedWatchlist,
    ...ratings,
    ...lists,
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
    basename === RATINGS_CSV ||
    basename === LISTS_CSV;

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

    // flatMap concatenates the row arrays internally (no argument spread), so
    // it stays safe on large accounts where `push(...rows)` would overflow the
    // stack (100k+ watch rows).
    const rowsOf = (bucket: GdprBucket) =>
      parsed
        .filter((file) => classifyGdprFile(file) === bucket)
        .flatMap((file) => file.rows);

    return parseGdprRows({
      v1Rows: rowsOf('v1') as TrackingV1Row[],
      v2Rows: rowsOf('v2') as TrackingV2Row[],
      followedRows: rowsOf('followed') as FollowedShowRow[],
      ratingRows: rowsOf('rating') as RatingVoteRow[],
      listRows: rowsOf('list') as ListRow[],
    });
  },
};
