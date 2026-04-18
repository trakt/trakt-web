import type { FileParser } from './ParserInterface.ts';
import { TvTimeLiberatorParser } from './TvTimeLiberatorParser.ts';
import { TvTimeNativeParser } from './TvTimeNativeParser.ts';
import { parseCsvFile } from './utils/parseCsvFile.ts';

function isLiberatorFormat(rows: unknown[]): boolean {
  const [first] = rows as Record<string, unknown>[];
  return first != null && 'imdb_id' in first;
}

export const TvTimeCsvParser: FileParser = {
  name: 'TV Time',

  canParse(files) {
    const [file] = files;
    return files.length === 1 && file?.name.endsWith('.csv') === true;
  },

  async parse(files) {
    const [file] = files;
    if (!file) return [];

    const rows = await parseCsvFile(file);

    if (isLiberatorFormat(rows)) {
      return TvTimeLiberatorParser.parse(files);
    }

    return TvTimeNativeParser.parse(files);
  },
};
