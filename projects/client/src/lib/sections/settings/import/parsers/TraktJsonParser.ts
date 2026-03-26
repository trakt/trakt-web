import { unzipSync } from 'fflate';
import type {
  ImportAction,
  ImportType,
  UniversalImportItem,
} from '../ImportTypes.ts';
import type { FileParser } from './ParserInterface.ts';
import { isValidItem } from './utils/isValidItem.ts';
import { parseJsonFile } from './utils/parseJsonFile.ts';
import { toISOString } from './utils/toISOString.ts';

type TraktJsonIds = {
  trakt?: number;
  imdb?: string;
  tmdb?: number;
  tvdb?: number;
};

type TraktJsonEntry = {
  type?: string;
  action?: string;
  watched_at?: string;
  date_watched?: string;
  listed_at?: string;
  watchlisted_at?: string;
  is_watchlisted?: boolean | string;
  rating?: number;
  rated_at?: string;
  movie?: { title?: string; year?: number; ids?: TraktJsonIds };
  show?: { title?: string; year?: number; ids?: TraktJsonIds };
  episode?: {
    season?: number;
    number?: number;
    ids?: TraktJsonIds;
  };
  // Flat format with nested id object (e.g. shared list exports)
  id?: TraktJsonIds;
  // Flat format with *_id fields at root level (e.g. third-party exports)
  imdb_id?: string;
  tvdb_id?: number;
  tmdb_id?: number;
  trakt_id?: number;
  title?: string;
  year?: number;
  created_at?: string;
  is_watched?: boolean;
};

function inferType(entry: TraktJsonEntry): ImportType {
  if (entry.episode) return 'episode';
  if (entry.show && !entry.movie) return 'show';
  return 'movie';
}

function inferAction(entry: TraktJsonEntry): ImportAction {
  if (entry.action) {
    const normalized = entry.action.toLowerCase();
    if (normalized === 'watchlist') return 'watchlist';
    if (normalized === 'ratings' || normalized === 'rating') return 'ratings';
    return 'history';
  }
  if (entry.rated_at !== undefined || entry.rating !== undefined) {
    return 'ratings';
  }
  if (
    entry.listed_at !== undefined ||
    entry.watchlisted_at !== undefined ||
    entry.is_watchlisted === true ||
    entry.is_watchlisted === 'true'
  ) return 'watchlist';
  return 'history';
}

function toType(value: string): ImportType {
  const normalized = value.toLowerCase();
  if (normalized === 'show' || normalized === 'series') return 'show';
  if (normalized === 'episode') return 'episode';
  return 'movie';
}

function toWatchedAt(value?: string): string | undefined {
  if (value === 'unknown') return 'unknown';
  return toISOString(value);
}

function isFlatEntry(entry: TraktJsonEntry): boolean {
  return (
    entry.id !== undefined &&
    entry.movie === undefined &&
    entry.show === undefined &&
    entry.episode === undefined
  );
}

function parseFlatEntry(entry: TraktJsonEntry): UniversalImportItem | null {
  const ids = entry.id ?? {};
  const action = inferAction(entry);

  return {
    action,
    type: 'movie',
    ids: {
      trakt: ids.trakt,
      imdb: ids.imdb,
      tmdb: ids.tmdb,
      tvdb: ids.tvdb,
    },
    title: entry.title,
    year: entry.year,
    watched_at: toWatchedAt(
      entry.watched_at ?? entry.date_watched ?? entry.created_at,
    ),
    rating: entry.rating,
    rated_at: toISOString(entry.rated_at),
  };
}

function isMultiIdFlatEntry(entry: TraktJsonEntry): boolean {
  return (
    (entry.imdb_id !== undefined ||
      entry.tvdb_id !== undefined ||
      entry.tmdb_id !== undefined ||
      entry.trakt_id !== undefined) &&
    entry.movie === undefined &&
    entry.show === undefined &&
    entry.episode === undefined
  );
}

function parseMultiIdFlatEntry(
  entry: TraktJsonEntry,
): UniversalImportItem | null {
  const action = inferAction(entry);

  return {
    action,
    type: 'movie',
    ids: {
      trakt: entry.trakt_id,
      imdb: entry.imdb_id,
      tmdb: entry.tmdb_id,
      tvdb: entry.tvdb_id,
    },
    title: entry.title,
    year: entry.year,
    watched_at: toWatchedAt(
      entry.watched_at ?? entry.date_watched ?? entry.created_at,
    ),
    rating: entry.rating,
    rated_at: toISOString(entry.rated_at),
  };
}

function parseTraktJsonEntry(
  entry: TraktJsonEntry,
): UniversalImportItem | null {
  if (isFlatEntry(entry)) return parseFlatEntry(entry);
  if (isMultiIdFlatEntry(entry)) return parseMultiIdFlatEntry(entry);

  const type = entry.type ? toType(entry.type) : inferType(entry);
  const action = inferAction(entry);

  const media = type === 'episode' ? entry.show : (entry.movie ?? entry.show);
  const episodeData = type === 'episode' ? entry.episode : undefined;

  const ids: TraktJsonIds = episodeData?.ids ?? media?.ids ?? {};

  return {
    action,
    type,
    ids: {
      trakt: ids.trakt,
      imdb: ids.imdb,
      tmdb: ids.tmdb,
      tvdb: ids.tvdb,
    },
    title: media?.title,
    year: media?.year,
    watched_at: toWatchedAt(entry.watched_at),
    rating: entry.rating,
    rated_at: toISOString(entry.rated_at),
    season: episodeData?.season,
    episode: episodeData?.number,
  };
}

function parseEntries(entries: TraktJsonEntry[]): UniversalImportItem[] {
  return entries
    .map(parseTraktJsonEntry)
    .filter((item): item is UniversalImportItem => item !== null)
    .filter(isValidItem);
}

function isRelevantJsonFile(filename: string): boolean {
  return filename.startsWith('watched/history') ||
    filename === 'lists/watchlist.json' ||
    filename.startsWith('ratings/ratings');
}

function inferActionFromPath(filename: string): ImportAction {
  if (filename.startsWith('ratings/')) return 'ratings';
  if (filename === 'lists/watchlist.json') return 'watchlist';
  return 'history';
}

async function parseTraktZip(file: File): Promise<UniversalImportItem[]> {
  const buffer = await file.arrayBuffer();
  const unzipped = unzipSync(new Uint8Array(buffer));
  const decoder = new TextDecoder('utf-8');

  return Object.entries(unzipped)
    .filter(([filename]) =>
      filename.endsWith('.json') && isRelevantJsonFile(filename)
    )
    .flatMap(([filename, data]) => {
      const text = decoder.decode(data);
      const raw = JSON.parse(text);
      const entries = Array.isArray(raw) ? raw : [raw];
      const action = inferActionFromPath(filename);

      return parseEntries(
        (entries as TraktJsonEntry[]).map((entry) => ({
          ...entry,
          action: entry.action ?? action,
        })),
      );
    });
}

export const TraktJsonParser: FileParser = {
  name: 'JSON File',

  canParse(files) {
    const [file] = files;
    return files.length === 1 &&
      (file?.name.endsWith('.json') === true ||
        file?.name.endsWith('.zip') === true);
  },

  async parse(files) {
    const [file] = files;
    if (!file) return [];

    if (file.name.endsWith('.zip')) {
      return parseTraktZip(file);
    }

    const raw = await parseJsonFile(file);
    const entries = Array.isArray(raw) ? raw : [raw];
    return parseEntries(entries as TraktJsonEntry[]);
  },
};
