import type { FileParser } from './ParserInterface.ts';
import { TvTimeGdprParser } from './TvTimeGdprParser.ts';
import { TvTimeLiberatorParser } from './TvTimeLiberatorParser.ts';
import { TvTimeNativeParser } from './TvTimeNativeParser.ts';
import { parseCsvFile } from './utils/parseCsvFile.ts';
import { zipEntryBasenames } from './utils/zipEntryBasenames.ts';

type TvTimeFormat = 'gdpr' | 'liberator' | 'native' | 'unknown';

const GDPR_ZIP_MARKER = 'tracking-prod-records';
const LIBERATOR_ZIP_MARKER = 'activity_history.csv';

// Columns that accompany episode_id in TV Time's native export. GDPR noise
// files (show_seen_episode_latest.csv, where-to-watch-prod-table.csv) also
// carry episode_id, so it alone is not enough to claim the native format.
const NATIVE_COMPANION_COLUMNS = [
  'ts',
  'show_name',
  'episode_name',
  'episode_season_number',
  'episode_number',
];

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

  throw new Error(
    'This .zip file does not look like a TV Time export. Upload the GDPR data export .zip or the Liberator export .zip.',
  );
}

async function detectFormat(file: File): Promise<TvTimeFormat> {
  if (file.name.endsWith('.zip')) return detectZipFormat(file);

  const [first] = await parseCsvFile(file) as Record<string, unknown>[];
  if (!first) return 'unknown';
  if ('imdb_id' in first) return 'liberator';
  if (
    'type-uuid-n' in first || 'ep_id' in first ||
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
      default:
        return parsePerFile(TvTimeNativeParser, recognized);
    }
  },
};
