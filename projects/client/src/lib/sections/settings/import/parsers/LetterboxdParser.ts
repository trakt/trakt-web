import { unzipSync } from 'fflate';
import type { UniversalImportItem } from '../ImportTypes.ts';
import type { FileParser } from './ParserInterface.ts';
import { isValidItem } from './utils/isValidItem.ts';
import { parseCsvText } from './utils/parseCsvText.ts';

type LetterboxdDiaryRow = {
  Date?: string;
  Name?: string;
  Year?: string;
  'Letterboxd URI'?: string;
  Rating?: string;
  'Watched Date'?: string;
  Rewatch?: string;
};

type LetterboxdRatingsRow = {
  Date?: string;
  Name?: string;
  Year?: string;
  'Letterboxd URI'?: string;
  Rating?: string;
};

type LetterboxdWatchlistRow = {
  Date?: string;
  Name?: string;
  Year?: string;
  'Letterboxd URI'?: string;
};

function parseDiaryRow(row: LetterboxdDiaryRow): UniversalImportItem | null {
  if (!row.Name) return null;

  const year = row.Year ? parseInt(row.Year, 10) : undefined;
  const watchedAt = row['Watched Date']
    ? new Date(row['Watched Date']).toISOString()
    : undefined;
  const rating = row.Rating ? parseFloat(row.Rating) * 2 : undefined;

  return {
    action: 'history',
    type: 'movie',
    ids: {},
    title: row.Name,
    year,
    watched_at: watchedAt,
    rating: rating && rating >= 1 ? Math.round(rating) : undefined,
  };
}

function parseRatingsRow(
  row: LetterboxdRatingsRow,
): UniversalImportItem | null {
  if (!row.Name) return null;

  const rating = row.Rating ? parseFloat(row.Rating) * 2 : undefined;

  return {
    action: 'ratings',
    type: 'movie',
    ids: {},
    title: row.Name,
    year: row.Year ? parseInt(row.Year, 10) : undefined,
    rating: rating && rating >= 1 ? Math.round(rating) : undefined,
    rated_at: row.Date ? new Date(row.Date).toISOString() : undefined,
  };
}

function parseWatchlistRow(
  row: LetterboxdWatchlistRow,
): UniversalImportItem | null {
  if (!row.Name) return null;

  return {
    action: 'watchlist',
    type: 'movie',
    ids: {},
    title: row.Name,
    year: row.Year ? parseInt(row.Year, 10) : undefined,
  };
}

async function parseLetterboxdZip(
  file: File,
): Promise<UniversalImportItem[]> {
  const buffer = await file.arrayBuffer();
  const unzipped = unzipSync(new Uint8Array(buffer));
  const decoder = new TextDecoder('utf-8');

  const items: UniversalImportItem[] = [];

  for (const [filename, data] of Object.entries(unzipped)) {
    const text = decoder.decode(data);

    if (filename === 'diary.csv') {
      const rows = await parseCsvText(text) as LetterboxdDiaryRow[];
      items.push(
        ...rows
          .map(parseDiaryRow)
          .filter((r): r is UniversalImportItem => r !== null)
          .filter(isValidItem),
      );
    } else if (filename === 'ratings.csv') {
      const rows = await parseCsvText(text) as LetterboxdRatingsRow[];
      items.push(
        ...rows
          .map(parseRatingsRow)
          .filter((r): r is UniversalImportItem => r !== null)
          .filter(isValidItem),
      );
    } else if (filename === 'watchlist.csv') {
      const rows = await parseCsvText(text) as LetterboxdWatchlistRow[];
      items.push(
        ...rows
          .map(parseWatchlistRow)
          .filter((r): r is UniversalImportItem => r !== null)
          .filter(isValidItem),
      );
    }
  }

  return items;
}

export const LetterboxdParser: FileParser = {
  name: 'Letterboxd',

  canParse(files) {
    const [file] = files;
    return files.length === 1 && file?.name.endsWith('.zip') === true;
  },

  async parse(files) {
    const [file] = files;
    if (!file) return [];
    return parseLetterboxdZip(file);
  },
};
