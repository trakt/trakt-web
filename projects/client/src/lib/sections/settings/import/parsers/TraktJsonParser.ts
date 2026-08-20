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
  season?: {
    number?: number;
    ids?: TraktJsonIds;
  };
  episode?: {
    season?: number;
    number?: number;
    ids?: TraktJsonIds;
  };
  // Flat format with nested id object (e.g. shared list exports). Exports put a
  // numeric play id here instead, which is not an id block.
  id?: TraktJsonIds | number;
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
  if (entry.season) return 'season';
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
  if (normalized === 'season') return 'season';
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

function toFlatIds(id: TraktJsonEntry['id']): TraktJsonIds {
  return typeof id === 'object' && id !== null ? id : {};
}

function toFlatBase(
  entry: TraktJsonEntry,
  ids: TraktJsonIds,
): ImportItemBase {
  return {
    type: resolveType(entry),
    ids: toImportIds(ids),
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

function toNestedBase(entry: TraktJsonEntry): ImportItemBase {
  const type = resolveType(entry);
  const media = type === 'episode' ? entry.show : (entry.movie ?? entry.show);
  const episodeData = type === 'episode' ? entry.episode : undefined;
  const seasonData = type === 'season' ? entry.season : undefined;
  const ids: TraktJsonIds = episodeData?.ids ?? seasonData?.ids ?? media?.ids ??
    {};

  return {
    type,
    ids: toImportIds(ids),
    title: media?.title,
    year: media?.year,
    season: episodeData?.season ?? seasonData?.number,
    episode: episodeData?.number,
  };
}

function toEntryBase(entry: TraktJsonEntry): ImportItemBase {
  if (isFlatEntry(entry)) return toFlatBase(entry, toFlatIds(entry.id));
  if (isMultiIdFlatEntry(entry)) {
    return toFlatBase(entry, {
      trakt: entry.trakt_id,
      imdb: entry.imdb_id,
      tmdb: entry.tmdb_id,
      tvdb: entry.tvdb_id,
    });
  }
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
    ...(entry.rating ?? 0) > 0
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

function toComparablePath(filename: string): string {
  return filename.replaceAll('/', '-');
}

function isRelevantJsonFile(filename: string): boolean {
  const path = toComparablePath(filename);
  return path.startsWith('watched-history') ||
    path.startsWith('lists-watchlist') ||
    path.startsWith('ratings-');
}

function inferActionFromPath(filename: string): ImportAction {
  const path = toComparablePath(filename);
  if (path.startsWith('ratings-')) return 'ratings';
  if (path.startsWith('lists-watchlist')) return 'watchlist';
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
