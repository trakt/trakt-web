import { unzipSync } from 'fflate';
import type {
  ImportAction,
  ImportType,
  UniversalImportItem,
} from '../ImportTypes.ts';
import type { FileParser } from './ParserInterface.ts';
import { isValidItem } from './utils/isValidItem.ts';
import { parseJsonFile } from './utils/parseJsonFile.ts';
import { toImportIds } from './utils/toImportIds.ts';
import { toImportISOString } from './utils/toImportISOString.ts';

type TraktJsonIds = {
  trakt?: string | number;
  imdb?: string;
  tmdb?: string | number;
  tvdb?: string | number;
};

type ImportItemBase = Omit<
  UniversalImportItem,
  'action' | 'watched_at' | 'rating' | 'rated_at'
>;

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
  tvdb_id?: string | number;
  tmdb_id?: string | number;
  trakt_id?: string | number;
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

function isWatchlisted(entry: TraktJsonEntry): boolean {
  return entry.listed_at !== undefined ||
    entry.watchlisted_at !== undefined ||
    entry.is_watchlisted === true ||
    entry.is_watchlisted === 'true';
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
  if (isWatchlisted(entry)) return 'watchlist';
  return 'history';
}

function toType(value: string): ImportType {
  const normalized = value.toLowerCase();
  if (normalized === 'show' || normalized === 'series') return 'show';
  if (normalized === 'episode') return 'episode';
  return 'movie';
}

function resolveType(entry: TraktJsonEntry): ImportType {
  return entry.type ? toType(entry.type) : inferType(entry);
}

function toWatchedAt(value?: string): string | undefined {
  if (value === 'unknown') return 'unknown';
  return toImportISOString(value);
}

function isFlatEntry(entry: TraktJsonEntry): boolean {
  return (
    entry.id !== undefined &&
    entry.movie === undefined &&
    entry.show === undefined &&
    entry.episode === undefined
  );
}

function toFlatBase(entry: TraktJsonEntry): ImportItemBase {
  return {
    type: resolveType(entry),
    ids: toImportIds(entry.id ?? {}),
    title: entry.title,
    year: entry.year,
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

function toMultiIdFlatBase(entry: TraktJsonEntry): ImportItemBase {
  return {
    type: resolveType(entry),
    ids: toImportIds({
      trakt: entry.trakt_id,
      imdb: entry.imdb_id,
      tmdb: entry.tmdb_id,
      tvdb: entry.tvdb_id,
    }),
    title: entry.title,
    year: entry.year,
  };
}

function toNestedBase(entry: TraktJsonEntry): ImportItemBase {
  const type = resolveType(entry);
  const media = type === 'episode' ? entry.show : (entry.movie ?? entry.show);
  const episodeData = type === 'episode' ? entry.episode : undefined;
  const ids: TraktJsonIds = episodeData?.ids ?? media?.ids ?? {};

  return {
    type,
    ids: toImportIds(ids),
    title: media?.title,
    year: media?.year,
    season: episodeData?.season,
    episode: episodeData?.number,
  };
}

function toEntryBase(entry: TraktJsonEntry): ImportItemBase {
  if (isFlatEntry(entry)) return toFlatBase(entry);
  if (isMultiIdFlatEntry(entry)) return toMultiIdFlatBase(entry);
  return toNestedBase(entry);
}

function parseTraktJsonEntry(entry: TraktJsonEntry): UniversalImportItem[] {
  const base = toEntryBase(entry);
  const watchedAt = toWatchedAt(entry.watched_at ?? entry.date_watched);
  const ratedAt = toImportISOString(entry.rated_at);

  if (entry.action) {
    return [{
      ...base,
      action: inferAction(entry),
      watched_at: watchedAt ?? toWatchedAt(entry.created_at),
      rating: entry.rating,
      rated_at: ratedAt,
    }];
  }

  const items: UniversalImportItem[] = [
    ...watchedAt
      ? [{ ...base, action: 'history' as const, watched_at: watchedAt }]
      : [],
    ...entry.rating != null
      ? [{
        ...base,
        action: 'ratings' as const,
        rating: entry.rating,
        rated_at: ratedAt,
      }]
      : [],
    ...isWatchlisted(entry) ? [{ ...base, action: 'watchlist' as const }] : [],
  ];

  if (items.length > 0) return items;

  return [{
    ...base,
    action: inferAction(entry),
    watched_at: toWatchedAt(entry.created_at),
    rating: entry.rating,
    rated_at: ratedAt,
  }];
}

function parseEntries(entries: TraktJsonEntry[]): UniversalImportItem[] {
  return entries
    .flatMap(parseTraktJsonEntry)
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
