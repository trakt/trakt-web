import type {
  ImportAction,
  ImportType,
  UniversalImportItem,
} from '../ImportTypes.ts';
import type { FileParser } from './ParserInterface.ts';
import { isValidItem } from './utils/isValidItem.ts';
import { parseCsvFile } from './utils/parseCsvFile.ts';

type TraktCsvRow = {
  type?: string;
  action?: string;
  title?: string;
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
  listed_at?: string;
  rating?: string;
  rated_at?: string;
  season?: string;
  episode?: string;
};

function inferAction(row: TraktCsvRow): ImportAction {
  if (row.action) {
    const normalized = row.action.toLowerCase();
    if (normalized === 'watchlist') return 'watchlist';
    if (normalized === 'ratings' || normalized === 'rating') return 'ratings';
    return 'history';
  }
  if (row.rated_at || row.rating) return 'ratings';
  if (row.listed_at) return 'watchlist';
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

function parseTraktCsvRow(row: TraktCsvRow): UniversalImportItem | null {
  const traktRaw = row.trakt ?? row.trakt_id;
  const tmdbRaw = row.tmdb ?? row.tmdb_id;
  const tvdbRaw = row.tvdb ?? row.tvdb_id;
  const imdbRaw = row.imdb ?? row.imdb_id;

  const ids = {
    trakt: toInt(traktRaw),
    imdb: imdbRaw || undefined,
    tmdb: toInt(tmdbRaw),
    tvdb: toInt(tvdbRaw),
  };

  const hasId = Boolean(ids.trakt) || Boolean(ids.imdb) || Boolean(ids.tmdb) ||
    Boolean(ids.tvdb);
  const title = row.title || undefined;
  const year = row.year ? parseInt(row.year, 10) : undefined;

  if (!hasId && (!title || !year)) return null;

  return {
    action: inferAction(row),
    type: toType(row.type),
    ids,
    title,
    year,
    watched_at: row.watched_at
      ? new Date(row.watched_at).toISOString()
      : undefined,
    rating: row.rating ? parseInt(row.rating, 10) : undefined,
    rated_at: row.rated_at ? new Date(row.rated_at).toISOString() : undefined,
    season: row.season ? parseInt(row.season, 10) : undefined,
    episode: row.episode ? parseInt(row.episode, 10) : undefined,
  };
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
    const rows = await parseCsvFile(file) as TraktCsvRow[];
    return rows
      .map(parseTraktCsvRow)
      .filter((item): item is UniversalImportItem => item !== null)
      .filter(isValidItem);
  },
};
