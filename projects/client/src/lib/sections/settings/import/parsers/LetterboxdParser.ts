import { unzipSync } from 'fflate';
import type { UniversalImportItem } from '../ImportTypes.ts';
import type { FileParser } from './ParserInterface.ts';
import { isValidItem } from './utils/isValidItem.ts';
import { parseCsvText } from './utils/parseCsvText.ts';
import { toISOString } from './utils/toISOString.ts';

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

type LetterboxdWatchedRow = {
  Date?: string;
  Name?: string;
  Year?: string;
  'Letterboxd URI'?: string;
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
  const watchedAt = toISOString(row['Watched Date']);
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
    rated_at: toISOString(row.Date),
  };
}

function parseWatchedRow(
  row: LetterboxdWatchedRow,
): UniversalImportItem | null {
  if (!row.Name) return null;

  return {
    action: 'history',
    type: 'movie',
    ids: {},
    title: row.Name,
    year: row.Year ? parseInt(row.Year, 10) : undefined,
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

  const csvTexts: Record<string, string> = {};
  for (const [filename, data] of Object.entries(unzipped)) {
    csvTexts[filename] = decoder.decode(data);
  }

  const items: UniversalImportItem[] = [];
  const diaryNames = new Set<string>();

  if (csvTexts['diary.csv']) {
    const rows = await parseCsvText(
      csvTexts['diary.csv'],
    ) as LetterboxdDiaryRow[];
    const diaryItems = rows
      .map(parseDiaryRow)
      .filter((r): r is UniversalImportItem => r !== null)
      .filter(isValidItem);

    for (const item of diaryItems) {
      if (item.title) diaryNames.add(item.title);
    }

    items.push(...diaryItems);
  }

  if (csvTexts['watched.csv']) {
    const rows = await parseCsvText(
      csvTexts['watched.csv'],
    ) as LetterboxdWatchedRow[];
    items.push(
      ...rows
        .map(parseWatchedRow)
        .filter((r): r is UniversalImportItem => r !== null)
        .filter(isValidItem)
        .filter((r) => !diaryNames.has(r.title ?? '')),
    );
  }

  if (csvTexts['ratings.csv']) {
    const rows = await parseCsvText(
      csvTexts['ratings.csv'],
    ) as LetterboxdRatingsRow[];
    items.push(
      ...rows
        .map(parseRatingsRow)
        .filter((r): r is UniversalImportItem => r !== null)
        .filter(isValidItem),
    );
  }

  if (csvTexts['watchlist.csv']) {
    const rows = await parseCsvText(
      csvTexts['watchlist.csv'],
    ) as LetterboxdWatchlistRow[];
    items.push(
      ...rows
        .map(parseWatchlistRow)
        .filter((r): r is UniversalImportItem => r !== null)
        .filter(isValidItem),
    );
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
    return await parseLetterboxdZip(file);
  },
};
