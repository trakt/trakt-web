import { unzipSync } from 'fflate';
import type { UniversalImportItem } from '../ImportTypes.ts';
import type { FileParser } from './ParserInterface.ts';
import { isValidItem } from './utils/isValidItem.ts';
import { parseCsvText } from './utils/parseCsvText.ts';
import { toImportISOString } from './utils/toImportISOString.ts';

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

type LetterboxdDatedRow = {
  Date?: string;
  Name?: string;
  Year?: string;
  'Letterboxd URI'?: string;
};

function toLetterboxdRating(raw: string | undefined): number | undefined {
  const rating = raw ? parseFloat(raw) * 2 : undefined;
  return rating && rating >= 1 ? Math.round(rating) : undefined;
}

function toValidItems<T>(
  rows: T[],
  parse: (row: T) => UniversalImportItem | null,
): UniversalImportItem[] {
  return rows
    .map(parse)
    .filter((r): r is UniversalImportItem => r !== null)
    .filter(isValidItem);
}

function parseDiaryRow(row: LetterboxdDiaryRow): UniversalImportItem | null {
  if (!row.Name) return null;

  const year = row.Year ? parseInt(row.Year, 10) : undefined;
  const watchedAt = toImportISOString(row['Watched Date']);
  return {
    action: 'history',
    type: 'movie',
    ids: {},
    title: row.Name,
    year,
    watched_at: watchedAt,
    rating: toLetterboxdRating(row.Rating),
  };
}

function parseRatingsRow(
  row: LetterboxdRatingsRow,
): UniversalImportItem | null {
  if (!row.Name) return null;

  return {
    action: 'ratings',
    type: 'movie',
    ids: {},
    title: row.Name,
    year: row.Year ? parseInt(row.Year, 10) : undefined,
    rating: toLetterboxdRating(row.Rating),
    rated_at: toImportISOString(row.Date),
  };
}

function parseWatchedRow(
  row: LetterboxdDatedRow,
): UniversalImportItem | null {
  if (!row.Name) return null;

  return {
    action: 'history',
    type: 'movie',
    ids: {},
    title: row.Name,
    year: row.Year ? parseInt(row.Year, 10) : undefined,
    watched_at: toImportISOString(row.Date),
  };
}

function parseWatchlistRow(
  row: LetterboxdDatedRow,
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

const EXPORT_FILES = [
  'diary.csv',
  'watched.csv',
  'ratings.csv',
  'watchlist.csv',
];

const IGNORED_FOLDERS = ['deleted', 'orphaned'];

function isExportFile(path: string): boolean {
  const segments = path.split('/');

  return EXPORT_FILES.includes(segments.at(-1) ?? '') &&
    !IGNORED_FOLDERS.includes(segments.at(-2) ?? '');
}

function toDepth(path: string): number {
  return path.split('/').length;
}

function toExportRoot(paths: ReadonlyArray<string>): string {
  const roots = paths
    .filter(isExportFile)
    .map((path) => path.slice(0, path.lastIndexOf('/') + 1));

  return roots.reduce(
    (shallowest, root) =>
      toDepth(root) < toDepth(shallowest) ? root : shallowest,
    roots.at(0) ?? '',
  );
}

async function parseLetterboxdZip(
  file: File,
): Promise<UniversalImportItem[]> {
  const buffer = await file.arrayBuffer();
  const unzipped = unzipSync(new Uint8Array(buffer));
  const decoder = new TextDecoder('utf-8');

  const root = toExportRoot(Object.keys(unzipped));

  const csvTexts: Record<string, string> = {};
  for (const [filename, data] of Object.entries(unzipped)) {
    if (!filename.startsWith(root)) continue;
    csvTexts[filename.slice(root.length)] = decoder.decode(data);
  }

  const items: UniversalImportItem[] = [];
  const diaryNames = new Set<string>();

  if (csvTexts['diary.csv']) {
    const rows = await parseCsvText(
      csvTexts['diary.csv'],
    ) as LetterboxdDiaryRow[];
    const diaryItems = toValidItems(rows, parseDiaryRow);

    for (const item of diaryItems) {
      if (item.title) diaryNames.add(item.title);
    }

    items.push(...diaryItems);
  }

  if (csvTexts['watched.csv']) {
    const rows = await parseCsvText(
      csvTexts['watched.csv'],
    ) as LetterboxdDatedRow[];
    items.push(
      ...toValidItems(rows, parseWatchedRow)
        .filter((r) => !diaryNames.has(r.title ?? '')),
    );
  }

  if (csvTexts['ratings.csv']) {
    const rows = await parseCsvText(
      csvTexts['ratings.csv'],
    ) as LetterboxdRatingsRow[];
    items.push(
      ...toValidItems(rows, parseRatingsRow),
    );
  }

  if (csvTexts['watchlist.csv']) {
    const rows = await parseCsvText(
      csvTexts['watchlist.csv'],
    ) as LetterboxdDatedRow[];
    items.push(
      ...toValidItems(rows, parseWatchlistRow),
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
