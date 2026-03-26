import type { UniversalImportItem } from '../ImportTypes.ts';
import type { FileParser } from './ParserInterface.ts';
import { parseCsvFile } from './utils/parseCsvFile.ts';
import { toISOString } from './utils/toISOString.ts';

type TvTimeNativeRow = {
  ts?: string;
  created_at?: string;
  show_name?: string;
  episode_id?: string;
  episode_season_number?: string;
  episode_number?: string;
  episode_name?: string;
};

function parseWatchedAt(row: TvTimeNativeRow): string | undefined {
  if (row.ts) {
    return new Date(Number(row.ts) * 1000).toISOString();
  }

  return toISOString(row.created_at);
}

function parseNativeRow(row: TvTimeNativeRow): UniversalImportItem | null {
  if (!row.episode_id) return null;

  const tvdbId = parseInt(row.episode_id, 10);
  if (isNaN(tvdbId)) return null;

  const watchedAt = parseWatchedAt(row);

  return {
    action: 'history',
    type: 'episode',
    ids: { tvdb: tvdbId },
    title: row.show_name,
    season: row.episode_season_number
      ? parseInt(row.episode_season_number, 10)
      : undefined,
    episode: row.episode_number ? parseInt(row.episode_number, 10) : undefined,
    watched_at: watchedAt,
  };
}

export const TvTimeNativeParser: FileParser = {
  name: 'TV Time Native',

  canParse(files) {
    const [file] = files;
    return files.length === 1 && file?.name.endsWith('.csv') === true;
  },

  async parse(files) {
    const [file] = files;
    if (!file) return [];

    const rows = await parseCsvFile(file);

    return (rows as TvTimeNativeRow[])
      .map(parseNativeRow)
      .filter((item): item is UniversalImportItem => item !== null);
  },
};
