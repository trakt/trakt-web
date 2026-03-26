import type {
  ImportAction,
  ImportType,
  UniversalImportItem,
} from '../ImportTypes.ts';
import type { FileParser } from './ParserInterface.ts';
import { isValidItem } from './utils/isValidItem.ts';
import { parseJsonFile } from './utils/parseJsonFile.ts';

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
  listed_at?: string;
  rating?: number;
  rated_at?: string;
  movie?: { title?: string; year?: number; ids?: TraktJsonIds };
  show?: { title?: string; year?: number; ids?: TraktJsonIds };
  episode?: {
    season?: number;
    number?: number;
    ids?: TraktJsonIds;
  };
  // Flat format (e.g. shared list exports): id/title at root level
  id?: TraktJsonIds;
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
  if (entry.listed_at !== undefined) return 'watchlist';
  return 'history';
}

function toType(value: string): ImportType {
  const normalized = value.toLowerCase();
  if (normalized === 'show' || normalized === 'series') return 'show';
  if (normalized === 'episode') return 'episode';
  return 'movie';
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
    watched_at: (entry.watched_at ?? entry.created_at)
      ? new Date((entry.watched_at ?? entry.created_at)!).toISOString()
      : undefined,
    rating: entry.rating,
    rated_at: entry.rated_at
      ? new Date(entry.rated_at).toISOString()
      : undefined,
  };
}

function parseTraktJsonEntry(
  entry: TraktJsonEntry,
): UniversalImportItem | null {
  if (isFlatEntry(entry)) return parseFlatEntry(entry);

  const type = entry.type ? toType(entry.type) : inferType(entry);
  const action = inferAction(entry);

  const media = type === 'episode' ? entry.show : (entry.movie ?? entry.show);
  const episodeData = type === 'episode' ? entry.episode : undefined;

  const ids: TraktJsonIds = media?.ids ?? episodeData?.ids ?? {};

  return {
    action,
    type,
    ids: {
      trakt: ids.trakt,
      imdb: ids.imdb,
      tmdb: ids.tmdb,
      tvdb: ids.tvdb ?? episodeData?.ids?.tvdb,
    },
    title: media?.title,
    year: media?.year,
    watched_at: entry.watched_at
      ? new Date(entry.watched_at).toISOString()
      : undefined,
    rating: entry.rating,
    rated_at: entry.rated_at
      ? new Date(entry.rated_at).toISOString()
      : undefined,
    season: episodeData?.season,
    episode: episodeData?.number,
  };
}

export const TraktJsonParser: FileParser = {
  name: 'JSON File',

  canParse(files) {
    const [file] = files;
    return files.length === 1 && file?.name.endsWith('.json') === true;
  },

  async parse(files) {
    const [file] = files;
    if (!file) return [];
    const raw = await parseJsonFile(file);
    const entries = Array.isArray(raw) ? raw : [raw];

    return (entries as TraktJsonEntry[])
      .map(parseTraktJsonEntry)
      .filter((item): item is UniversalImportItem => item !== null)
      .filter(isValidItem);
  },
};
