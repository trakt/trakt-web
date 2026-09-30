import type { UniversalImportItem } from '../ImportTypes.ts';
import type { FileParser } from './ParserInterface.ts';
import { isValidItem } from './utils/isValidItem.ts';
import { parseCsvText } from './utils/parseCsvText.ts';
import { toImportIds } from './utils/toImportIds.ts';
import { toImportISOString } from './utils/toImportISOString.ts';
import { unzipCsvTexts } from './utils/unzipCsvTexts.ts';

const TV_TIME_EXTRACTOR_CSV = 'tv-time-export.csv';

type TvTimeExtractorRow = {
  type?: string;
  media_type?: string;
  tmdb_id?: string;
  imdb_id?: string;
  title?: string;
  year?: string;
  watched_at?: string;
};

function toYear(value?: string): number | undefined {
  const year = parseInt(value ?? '', 10);
  return isNaN(year) ? undefined : year;
}

function parseExtractorRow(
  row: TvTimeExtractorRow,
): UniversalImportItem[] {
  if (row.type !== 'watch' || row.media_type !== 'movie') return [];

  return [{
    action: 'history',
    type: 'movie',
    ids: toImportIds({ imdb: row.imdb_id, tmdb: row.tmdb_id }),
    title: row.title || undefined,
    year: toYear(row.year),
    watched_at: toImportISOString(row.watched_at),
  }];
}

async function readCsvTexts(file: File): Promise<string[]> {
  if (!file.name.endsWith('.zip')) return [await file.text()];

  return unzipCsvTexts({
    buffer: await file.arrayBuffer(),
    isMatch: (basename) => basename === TV_TIME_EXTRACTOR_CSV,
  }).map((entry) => entry.text);
}

export const TvTimeExtractorParser: FileParser = {
  name: 'TV Time Extractor',

  canParse(files) {
    const [file] = files;
    return files.length === 1 &&
      (file?.name.endsWith('.csv') === true ||
        file?.name.endsWith('.zip') === true);
  },

  async parse(files) {
    const [file] = files;
    if (!file) return [];

    const texts = await readCsvTexts(file);
    const rows = (await Promise.all(texts.map(parseCsvText))).flat();

    return (rows as TvTimeExtractorRow[])
      .flatMap(parseExtractorRow)
      .filter(isValidItem);
  },
};
