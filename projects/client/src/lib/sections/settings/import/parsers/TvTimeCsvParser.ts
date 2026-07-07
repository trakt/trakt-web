import type { FileParser } from './ParserInterface.ts';
import { TvTimeExportParser } from './TvTimeExportParser.ts';
import { TvTimeGdprParser } from './TvTimeGdprParser.ts';
import { TvTimeLiberatorParser } from './TvTimeLiberatorParser.ts';
import { TvTimeNativeParser } from './TvTimeNativeParser.ts';
import { parseCsvFile } from './utils/parseCsvFile.ts';
import { zipEntryBasenames } from './utils/zipEntryBasenames.ts';

type TvTimeFormat = 'gdpr' | 'liberator' | 'native' | 'export' | 'unknown';

const GDPR_ZIP_MARKER = 'tracking-prod-records';
const LIBERATOR_ZIP_MARKER = 'activity_history.csv';

// Columns unique to TV Time's native export. GDPR noise files
// (show_seen_episode_latest.csv, where-to-watch-prod-table.csv) also carry
// episode_id + episode_number, so those generic columns can't be used to
// claim the native format — only the show_name/ts/episode_name family is.
const NATIVE_COMPANION_COLUMNS = [
  'ts',
  'show_name',
  'episode_name',
  'episode_season_number',
];

// The current "export my data" tool emits tvtime-*.csv files (loose or zipped
// as tvtime-export-*.zip); series-episodes carries a series_tvdb_id column.
function isExportCsv(file: File, first: Record<string, unknown>): boolean {
  return file.name.startsWith('tvtime-') || 'series_tvdb_id' in first;
}

async function detectZipFormat(file: File): Promise<TvTimeFormat> {
  const buffer = await file.arrayBuffer();
  const basenames = (() => {
    try {
      return zipEntryBasenames(buffer);
    } catch {
      throw new Error(
        'Could not read the .zip file. If it is password protected, extract it first and upload the CSV files inside instead.',
      );
    }
  })();

  if (basenames.some((name) => name.startsWith(GDPR_ZIP_MARKER))) {
    return 'gdpr';
  }
  if (basenames.includes(LIBERATOR_ZIP_MARKER)) return 'liberator';
  if (
    basenames.some((name) =>
      name.startsWith('tvtime-') &&
      (name.endsWith('.csv') || name.endsWith('.json'))
    )
  ) {
    return 'export';
  }

  throw new Error(
    'This .zip file does not look like a TV Time export. Upload the GDPR data export .zip or the Liberator export .zip.',
  );
}

async function detectFormat(file: File): Promise<TvTimeFormat> {
  if (file.name.endsWith('.zip')) return detectZipFormat(file);

  const [first] = await parseCsvFile(file) as Record<string, unknown>[];
  if (!first) return 'unknown';
  if (isExportCsv(file, first)) return 'export';
  if ('imdb_id' in first) return 'liberator';
  if (
    'type-uuid-n' in first || 'key' in first ||
    'notification_offset' in first || 'vote_key' in first
  ) {
    return 'gdpr';
  }

  const isNative = 'episode_id' in first &&
    NATIVE_COMPANION_COLUMNS.some((column) => column in first);
  return isNative ? 'native' : 'unknown';
}

function parsePerFile(parser: FileParser, files: ReadonlyArray<File>) {
  return Promise.all(files.map((file) => parser.parse([file])))
    .then((results) => results.flat());
}

export const TvTimeCsvParser: FileParser = {
  name: 'TV Time',

  canParse(files) {
    return files.length > 0 &&
      files.every(
        (file) => file.name.endsWith('.csv') || file.name.endsWith('.zip'),
      );
  },

  async parse(files) {
    if (files.length === 0) return [];

    // Whole-folder drops include noise files (device_data.csv, JSON
    // sidecars); unrecognized files are ignored instead of breaking the
    // import.
    const formats = await Promise.all(files.map(detectFormat));
    const recognized = files.filter(
      (_, index) => formats[index] !== 'unknown',
    );
    const distinct = new Set(
      formats.filter((format) => format !== 'unknown'),
    );

    if (distinct.size === 0) {
      throw new Error(
        'None of these files look like a TV Time export. Upload the Liberator export or the GDPR data export.',
      );
    }

    if (distinct.size > 1) {
      throw new Error(
        'These files come from different TV Time exports. Import either the Liberator export or the GDPR data export, not both at once.',
      );
    }

    const [format] = distinct;

    switch (format) {
      case 'liberator':
        return parsePerFile(TvTimeLiberatorParser, recognized);
      case 'gdpr':
        return TvTimeGdprParser.parse(recognized);
      case 'export':
        return TvTimeExportParser.parse(recognized);
      default:
        return parsePerFile(TvTimeNativeParser, recognized);
    }
  },
};
