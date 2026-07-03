import type { ImportType, UniversalImportItem } from '../ImportTypes.ts';
import type { FileParser } from './ParserInterface.ts';
import { parseCsvFile } from './utils/parseCsvFile.ts';
import { parseCsvText } from './utils/parseCsvText.ts';
import { toISOString } from './utils/toISOString.ts';
import { unzipCsvTexts } from './utils/unzipCsvTexts.ts';

const ACTIVITY_HISTORY_CSV = 'activity_history.csv';

type TvTimeLiberatorRow = {
  imdb_id?: string;
  tvdb_id?: string;
  type?: string;
  title?: string;
  season?: string;
  episode?: string;
  is_special?: string;
  is_watched?: string;
  watched_at?: string;
  status?: string;
  is_watchlisted?: string;
  rating?: string;
};

function toInt(value?: string): number | undefined {
  if (!value) return undefined;
  const n = parseInt(value, 10);
  return isNaN(n) ? undefined : n;
}

function toImportType(value?: string): ImportType {
  const normalized = (value ?? 'movie').toLowerCase();
  if (normalized === 'show' || normalized === 'series') return 'show';
  if (normalized === 'episode') return 'episode';
  return 'movie';
}

function parseLiberatorRow(row: TvTimeLiberatorRow): UniversalImportItem[] {
  const imdbId = row.imdb_id && row.imdb_id !== '-1' ? row.imdb_id : undefined;
  const tvdbId = toInt(row.tvdb_id);

  if (!imdbId && tvdbId == null) return [];

  const base = {
    type: toImportType(row.type),
    ids: { imdb: imdbId, tvdb: tvdbId },
    title: row.title || undefined,
    season: toInt(row.season),
    episode: toInt(row.episode),
  };

  const items: UniversalImportItem[] = [];

  if (row.is_watched === 'true') {
    items.push({
      ...base,
      action: 'history',
      watched_at: toISOString(row.watched_at),
    });
  }

  if (row.is_watchlisted === 'true') {
    items.push({ ...base, action: 'watchlist' });
  }

  // Episode ratings are skipped: the ratings sync payload only carries
  // movies and shows.
  const rating = toInt(row.rating);
  if (rating != null && base.type !== 'episode') {
    items.push({ ...base, action: 'ratings', rating });
  }

  return items;
}

// The Liberator zip also holds movies.json/shows.json, but
// activity_history.csv carries the same data plus watchlist flags.
async function unzipActivityHistoryRows(file: File): Promise<unknown[]> {
  const buffer = await file.arrayBuffer();
  const texts = (() => {
    try {
      return unzipCsvTexts({
        buffer,
        isMatch: (basename) => basename === ACTIVITY_HISTORY_CSV,
      }).map((entry) => entry.text);
    } catch {
      throw new Error(
        `Could not read the .zip file. Extract it and upload ${ACTIVITY_HISTORY_CSV} instead.`,
      );
    }
  })();

  const parsed = await Promise.all(texts.map(parseCsvText));
  return parsed.flat();
}

export const TvTimeLiberatorParser: FileParser = {
  name: 'TV Time Liberator',

  canParse(files) {
    const [file] = files;
    return files.length === 1 &&
      (file?.name.endsWith('.csv') === true ||
        file?.name.endsWith('.zip') === true);
  },

  async parse(files) {
    const [file] = files;
    if (!file) return [];

    const rows = file.name.endsWith('.zip')
      ? await unzipActivityHistoryRows(file)
      : await parseCsvFile(file);

    return (rows as TvTimeLiberatorRow[]).flatMap(parseLiberatorRow);
  },
};
