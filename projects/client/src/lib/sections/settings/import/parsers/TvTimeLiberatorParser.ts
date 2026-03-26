import type { ImportType, UniversalImportItem } from '../ImportTypes.ts';
import type { FileParser } from './ParserInterface.ts';
import { parseCsvFile } from './utils/parseCsvFile.ts';

type TvTimeLiberatorRow = {
  imdb_id?: string;
  tvdb_id?: string;
  type?: string;
  title?: string;
  season?: string;
  episode?: string;
  is_special?: string;
  is_watched?: string;
  watched_at?: string;
  status?: string;
  is_watchlisted?: string;
};

function toInt(value?: string): number | undefined {
  if (!value) return undefined;
  const n = parseInt(value, 10);
  return isNaN(n) ? undefined : n;
}

function toImportType(value?: string): ImportType {
  const normalized = (value ?? 'movie').toLowerCase();
  if (normalized === 'show' || normalized === 'series') return 'show';
  if (normalized === 'episode') return 'episode';
  return 'movie';
}

function parseLiberatorRow(row: TvTimeLiberatorRow): UniversalImportItem[] {
  const imdbId = row.imdb_id && row.imdb_id !== '-1' ? row.imdb_id : undefined;
  const tvdbId = toInt(row.tvdb_id);

  if (!imdbId && tvdbId == null) return [];

  const base = {
    type: toImportType(row.type),
    ids: { imdb: imdbId, tvdb: tvdbId },
    title: row.title || undefined,
    season: toInt(row.season),
    episode: toInt(row.episode),
  };

  const items: UniversalImportItem[] = [];

  if (row.is_watched === 'true') {
    items.push({
      ...base,
      action: 'history',
      watched_at: row.watched_at
        ? new Date(row.watched_at).toISOString()
        : undefined,
    });
  }

  if (row.is_watchlisted === 'true') {
    items.push({ ...base, action: 'watchlist' });
  }

  return items;
}

export const TvTimeLiberatorParser: FileParser = {
  name: 'TV Time Liberator',

  canParse(files) {
    const [file] = files;
    return files.length === 1 && file?.name.endsWith('.csv') === true;
  },

  async parse(files) {
    const [file] = files;
    if (!file) return [];

    const rows = await parseCsvFile(file);
    return (rows as TvTimeLiberatorRow[]).flatMap(parseLiberatorRow);
  },
};
