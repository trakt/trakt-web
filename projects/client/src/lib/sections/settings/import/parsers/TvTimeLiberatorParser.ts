import type { ImportType, UniversalImportItem } from '../ImportTypes.ts';
import type { FileParser } from './ParserInterface.ts';
import { parseCsvFile } from './utils/parseCsvFile.ts';
import { parseCsvText } from './utils/parseCsvText.ts';
import { toImportISOString } from './utils/toImportISOString.ts';
import { toInt } from './utils/toInt.ts';
import {
  type LiberatorEpisodeShow,
  toLiberatorEpisodeShows,
} from './utils/toLiberatorEpisodeShows.ts';
import { unzipCsvTexts } from './utils/unzipCsvTexts.ts';

const ACTIVITY_HISTORY_CSV = 'activity_history.csv';
const WATCHLIST_CSV = 'watchlist.csv';
const SHOWS_JSON = 'shows.json';
const EPISODE_WATCHES_JSON = 'episode_watches.json';
const ZIP_ENTRIES = [
  ACTIVITY_HISTORY_CSV,
  WATCHLIST_CSV,
  SHOWS_JSON,
  EPISODE_WATCHES_JSON,
];

type ParsedLiberatorFile = {
  rows: unknown[];
  episodeShows: ReadonlyMap<number, LiberatorEpisodeShow>;
};

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

function toImportType(value?: string): ImportType {
  const normalized = (value ?? 'movie').toLowerCase();
  if (normalized === 'show' || normalized === 'series') return 'show';
  if (normalized === 'episode') return 'episode';
  return 'movie';
}

function parseLiberatorRow(
  row: TvTimeLiberatorRow,
  episodeShows: ReadonlyMap<number, LiberatorEpisodeShow>,
): UniversalImportItem[] {
  const imdbId = row.imdb_id && row.imdb_id !== '-1' ? row.imdb_id : undefined;
  const tvdbId = toInt(row.tvdb_id);

  if (!imdbId && tvdbId == null) return [];

  const type = toImportType(row.type);
  const show =
    type === 'episode' && tvdbId != null ? episodeShows.get(tvdbId) : undefined;

  const base = {
    type,
    ids: { imdb: imdbId, tvdb: tvdbId },
    title: row.title || undefined,
    season: toInt(row.season) ?? show?.season,
    episode: toInt(row.episode) ?? show?.episode,
    showTvdb: show?.showTvdb,
  };

  const items: UniversalImportItem[] = [];

  if (row.is_watched === 'true') {
    items.push({
      ...base,
      action: 'history',
      watched_at: toImportISOString(row.watched_at),
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

function parseJsonArray(text?: string): unknown[] {
  if (!text) return [];
  try {
    const parsed: unknown = JSON.parse(text);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function unzipLiberatorEntries(buffer: ArrayBuffer) {
  try {
    return unzipCsvTexts({
      buffer,
      isMatch: (basename) => ZIP_ENTRIES.includes(basename),
    });
  } catch {
    throw new Error(
      `Could not read the .zip file. Extract it and upload ${ACTIVITY_HISTORY_CSV} instead.`,
    );
  }
}

// activity_history.csv carries the same data as the movies/shows JSON plus
// watchlist flags. Some exports hold watchlist.csv in its place.
async function unzipLiberator(file: File): Promise<ParsedLiberatorFile> {
  const entries = unzipLiberatorEntries(await file.arrayBuffer());
  const textsOf = (basename: string) =>
    entries.filter((entry) => entry.basename === basename);

  const csvEntries = textsOf(ACTIVITY_HISTORY_CSV).length
    ? textsOf(ACTIVITY_HISTORY_CSV)
    : textsOf(WATCHLIST_CSV);
  const rows = (
    await Promise.all(csvEntries.map((entry) => parseCsvText(entry.text)))
  ).flat();

  const episodeShows = toLiberatorEpisodeShows({
    shows: textsOf(SHOWS_JSON).flatMap((entry) => parseJsonArray(entry.text)),
    episodeWatches: textsOf(EPISODE_WATCHES_JSON).flatMap((entry) =>
      parseJsonArray(entry.text),
    ),
  });

  return { rows, episodeShows };
}

export const TvTimeLiberatorParser: FileParser = {
  name: 'TV Time Liberator',

  canParse(files) {
    const [file] = files;
    return (
      files.length === 1 &&
      (file?.name.endsWith('.csv') === true ||
        file?.name.endsWith('.zip') === true)
    );
  },

  async parse(files) {
    const [file] = files;
    if (!file) return [];

    const { rows, episodeShows } = file.name.endsWith('.zip')
      ? await unzipLiberator(file)
      : {
          rows: await parseCsvFile(file),
          episodeShows: new Map<number, LiberatorEpisodeShow>(),
        };

    return (rows as TvTimeLiberatorRow[]).flatMap((row) =>
      parseLiberatorRow(row, episodeShows),
    );
  },
};
