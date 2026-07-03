import type { FileParser } from './ParserInterface.ts';
import { TvTimeGdprParser } from './TvTimeGdprParser.ts';
import { TvTimeLiberatorParser } from './TvTimeLiberatorParser.ts';
import { TvTimeNativeParser } from './TvTimeNativeParser.ts';
import { parseCsvFile } from './utils/parseCsvFile.ts';
import { zipEntryBasenames } from './utils/zipEntryBasenames.ts';

type TvTimeFormat = 'gdpr' | 'liberator' | 'native';

const GDPR_ZIP_MARKER = 'tracking-prod-records';
const LIBERATOR_ZIP_MARKER = 'activity_history.csv';

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
  if (!first) return 'native';
  if ('imdb_id' in first) return 'liberator';
  if ('type-uuid-n' in first || 'ep_id' in first) return 'gdpr';
  return 'native';
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
    const formats = await Promise.all(files.map(detectFormat));
    const distinct = new Set(formats);

    if (distinct.size > 1) {
      throw new Error(
        'These files come from different TV Time exports. Import either the Liberator export or the GDPR data export, not both at once.',
      );
    }

    const [format] = distinct;

    switch (format) {
      case 'liberator':
        return parsePerFile(TvTimeLiberatorParser, files);
      case 'gdpr':
        return TvTimeGdprParser.parse(files);
      default:
        return parsePerFile(TvTimeNativeParser, files);
    }
  },
};
