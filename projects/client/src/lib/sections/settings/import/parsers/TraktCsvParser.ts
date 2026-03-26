import type {
  ImportAction,
  ImportType,
  UniversalImportItem,
} from '../ImportTypes.ts';
import type { FileParser } from './ParserInterface.ts';
import { isValidItem } from './utils/isValidItem.ts';
import { parseCsvFile } from './utils/parseCsvFile.ts';
import { toISOString } from './utils/toISOString.ts';

type TraktCsvRow = {
  type?: string;
  action?: string;
  title?: string;
  name?: string;
  year?: string;
  // Trakt exports use bare names; older/custom exports may use _id suffix
  trakt?: string;
  trakt_id?: string;
  imdb?: string;
  imdb_id?: string;
  tmdb?: string;
  tmdb_id?: string;
  tvdb?: string;
  tvdb_id?: string;
  watched_at?: string;
  date_watched?: string;
  listed_at?: string;
  watchlisted_at?: string;
  rating?: string;
  rated_at?: string;
  season?: string;
  episode?: string;
};

function normalizeRowKeys(row: Record<string, unknown>): TraktCsvRow {
  return Object.fromEntries(
    Object.entries(row).map(([key, value]) => [
      key.toLowerCase().trim(),
      value != null ? String(value) : undefined,
    ]),
  ) as TraktCsvRow;
}

function toWatchedAt(value?: string): string | undefined {
  if (value === 'unknown') return 'unknown';
  return toISOString(value);
}

function inferAction(row: TraktCsvRow): ImportAction {
  if (row.action) {
    const normalized = row.action.toLowerCase();
    if (normalized === 'watchlist') return 'watchlist';
    if (normalized === 'ratings' || normalized === 'rating') return 'ratings';
    return 'history';
  }
  if (row.rated_at || row.rating) return 'ratings';
  if (row.listed_at || row.watchlisted_at) return 'watchlist';
  return 'history';
}

function toType(value?: string): ImportType {
  const normalized = (value ?? 'movie').toLowerCase();
  if (
    normalized === 'show' || normalized === 'series' ||
    normalized === 'tv series'
  ) return 'show';
  if (normalized === 'episode') return 'episode';
  return 'movie';
}

function toInt(value?: string): number | undefined {
  if (!value) return undefined;
  const n = parseInt(value, 10);
  return isNaN(n) || n === 0 ? undefined : n;
}

function extractIds(row: TraktCsvRow) {
  return {
    trakt: toInt(row.trakt ?? row.trakt_id),
    imdb: (row.imdb ?? row.imdb_id) || undefined,
    tmdb: toInt(row.tmdb ?? row.tmdb_id),
    tvdb: toInt(row.tvdb ?? row.tvdb_id),
  };
}

function hasAnyId(ids: ReturnType<typeof extractIds>): boolean {
  return Boolean(ids.trakt) || Boolean(ids.imdb) || Boolean(ids.tmdb) ||
    Boolean(ids.tvdb);
}

function buildBaseItem(
  row: TraktCsvRow,
  ids: ReturnType<typeof extractIds>,
) {
  return {
    type: toType(row.type),
    ids,
    title: row.title ?? row.name ?? undefined,
    year: row.year ? parseInt(row.year, 10) : undefined,
    season: row.season ? parseInt(row.season, 10) : undefined,
    episode: row.episode ? parseInt(row.episode, 10) : undefined,
  };
}

type RowItemContext = {
  base: ReturnType<typeof buildBaseItem>;
  row: TraktCsvRow;
  watchedAt: string | undefined;
  rating: number | undefined;
  ratedAt: string | undefined;
  listedAt: string | undefined;
};

function buildExplicitActionItems(ctx: RowItemContext): UniversalImportItem[] {
  const { base, row, watchedAt, rating, ratedAt } = ctx;
  const action = inferAction(row);
  return [{
    ...base,
    action,
    watched_at: watchedAt,
    rating: action === 'ratings' ? rating : undefined,
    rated_at: action === 'ratings' ? ratedAt : undefined,
  }];
}

function buildInferredItems(ctx: RowItemContext): UniversalImportItem[] {
  const { base, row, watchedAt, rating, ratedAt, listedAt } = ctx;
  const items: UniversalImportItem[] = [];

  if (watchedAt) {
    items.push({ ...base, action: 'history', watched_at: watchedAt });
  }

  if (rating != null && !isNaN(rating)) {
    items.push({ ...base, action: 'ratings', rating, rated_at: ratedAt });
  }

  if (listedAt) {
    items.push({ ...base, action: 'watchlist' });
  }

  if (items.length === 0) {
    items.push({
      ...base,
      action: inferAction(row),
      watched_at: watchedAt,
      rating,
      rated_at: ratedAt,
    });
  }

  return items;
}

function parseTraktCsvRow(
  raw: Record<string, unknown>,
): UniversalImportItem[] {
  const row = normalizeRowKeys(raw);
  const ids = extractIds(row);
  const title = row.title ?? row.name ?? undefined;
  const year = row.year ? parseInt(row.year, 10) : undefined;

  if (!hasAnyId(ids) && (!title || !year)) return [];

  const ctx: RowItemContext = {
    base: buildBaseItem(row, ids),
    row,
    watchedAt: toWatchedAt(row.watched_at ?? row.date_watched),
    rating: row.rating ? parseInt(row.rating, 10) : undefined,
    ratedAt: toISOString(row.rated_at),
    listedAt: row.listed_at ?? row.watchlisted_at,
  };

  if (row.action) return buildExplicitActionItems(ctx);
  return buildInferredItems(ctx);
}

export const TraktCsvParser: FileParser = {
  name: 'CSV File',

  canParse(files) {
    const [file] = files;
    return files.length === 1 && file?.name.endsWith('.csv') === true;
  },

  async parse(files) {
    const [file] = files;
    if (!file) return [];
    const rows = await parseCsvFile(file) as Record<string, unknown>[];
    return rows
      .flatMap(parseTraktCsvRow)
      .filter(isValidItem);
  },
};
