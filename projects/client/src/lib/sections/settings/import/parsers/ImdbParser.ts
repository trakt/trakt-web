import type { UniversalImportItem } from '../ImportTypes.ts';
import type { FileParser } from './ParserInterface.ts';
import { isValidItem } from './utils/isValidItem.ts';
import { parseCsvFile } from './utils/parseCsvFile.ts';

type ImdbRatingsRow = {
  Const?: string;
  'Your Rating'?: string;
  'Date Rated'?: string;
  Title?: string;
  Year?: string;
  'Title Type'?: string;
};

type ImdbWatchlistRow = {
  Const?: string;
  Created?: string;
  Title?: string;
  Year?: string;
  'Title Type'?: string;
};

const IMDB_TITLE_TYPE_MAP: Record<string, UniversalImportItem['type']> = {
  movie: 'movie',
  'tv movie': 'movie',
  'tv series': 'show',
  'tv mini series': 'show',
  tvminiseries: 'show',
  tvseries: 'show',
  tvmovie: 'movie',
  'tv episode': 'episode',
  tvepisode: 'episode',
};

function toImportType(titleType?: string): UniversalImportItem['type'] {
  const normalized = (titleType ?? '').toLowerCase().replace(/\s+/g, '');
  return IMDB_TITLE_TYPE_MAP[normalized] ?? 'movie';
}

function parseRatingsRow(row: ImdbRatingsRow): UniversalImportItem[] {
  if (!row.Const?.startsWith('tt')) return [];

  const type = toImportType(row['Title Type']);
  const rating = row['Your Rating'] ? Number(row['Your Rating']) : undefined;
  const ratedAt = row['Date Rated']
    ? new Date(row['Date Rated']).toISOString()
    : undefined;

  const ratingItem: UniversalImportItem = {
    action: 'ratings',
    type,
    ids: { imdb: row.Const },
    title: row.Title,
    year: row.Year ? parseInt(row.Year, 10) : undefined,
    rating,
    rated_at: ratedAt,
  };

  const historyItem: UniversalImportItem = {
    action: 'history',
    type,
    ids: { imdb: row.Const },
    title: row.Title,
    year: row.Year ? parseInt(row.Year, 10) : undefined,
    watched_at: ratedAt,
  };

  return [ratingItem, historyItem];
}

function parseWatchlistRow(row: ImdbWatchlistRow): UniversalImportItem | null {
  if (!row.Const?.startsWith('tt')) return null;

  return {
    action: 'watchlist',
    type: toImportType(row['Title Type']),
    ids: { imdb: row.Const },
    title: row.Title,
    year: row.Year ? parseInt(row.Year, 10) : undefined,
  };
}

function isRatingsFile(rows: unknown[]): boolean {
  const first = rows[0] as Record<string, unknown>;
  return Boolean(first?.['Your Rating']);
}

async function parseImdbFile(
  file: File,
): Promise<UniversalImportItem[]> {
  const rows = await parseCsvFile(file);

  if (rows.length === 0) return [];

  if (isRatingsFile(rows)) {
    return (rows as ImdbRatingsRow[])
      .flatMap(parseRatingsRow)
      .filter(isValidItem);
  }

  return (rows as ImdbWatchlistRow[])
    .map(parseWatchlistRow)
    .filter((item): item is UniversalImportItem => item !== null)
    .filter(isValidItem);
}

export const ImdbParser: FileParser = {
  name: 'IMDb',

  canParse(files) {
    return files.every((f) => f.name.endsWith('.csv'));
  },

  async parse(files) {
    const results = await Promise.all(files.map(parseImdbFile));
    return results.flat();
  },
};
