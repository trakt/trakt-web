import type { UniversalImportItem } from '../ImportTypes.ts';
import type { FileParser } from './ParserInterface.ts';
import { parseCsvText } from './utils/parseCsvText.ts';
import { toISOString } from './utils/toISOString.ts';
import { unzipCsvTexts } from './utils/unzipCsvTexts.ts';

// The current TV Time "export my data" tool emits a set of tvtime-*.* files
// (loose or zipped as tvtime-export-*.zip) in either a CSV or a JSON
// serialization: a per-episode watch log, a movie watch log, a series-status
// list, and custom lists. Columns/fields carry TVDB ids directly, so no id
// resolution is needed. When both serializations are uploaded together we
// parse every file and de-duplicate, so overlapping watches aren't imported
// twice and items only one format carries (e.g. a JSON-only watchlist) aren't
// silently dropped.

type EpisodeRow = {
  series_tvdb_id?: string;
  title?: string;
  season?: string;
  episode?: string;
  tvdb_id?: string;
  is_watched?: string;
  watched_at?: string;
};

type MovieRow = {
  tvdb_id?: string;
  imdb_id?: string;
  title?: string;
  year?: string;
  watched_at?: string;
  is_watched?: string;
};

type SeriesRow = {
  tvdb_id?: string;
  imdb_id?: string;
  title?: string;
  status?: string;
};

type ListRow = {
  list_name?: string;
  item_type?: string;
  tvdb_id?: string;
  name?: string;
};

type JsonId = { tvdb?: number | null; imdb?: string | null };
type JsonEpisode = {
  id?: JsonId;
  number?: number;
  is_watched?: boolean;
  watched_at?: string;
};
type JsonSeason = { number?: number; episodes?: JsonEpisode[] };
type JsonShow = {
  id?: JsonId;
  title?: string;
  status?: string;
  seasons?: JsonSeason[];
};
type JsonMovie = {
  id?: JsonId;
  title?: string;
  year?: number;
  watched_at?: string;
  is_watched?: boolean;
};

// Only shows the user has not started yet belong on the watchlist; the rest
// (up_to_date, continuing, stopped) either already have episode history or
// were dropped.
const WATCHLIST_SERIES_STATUS = 'not_started_yet';

function toInt(value?: string): number | undefined {
  if (!value) return undefined;
  const n = parseInt(value, 10);
  return isNaN(n) ? undefined : n;
}

function toImdb(value?: string | null): string | undefined {
  return value && value !== '-1' ? value : undefined;
}

function toTvdb(value?: number | null): number | undefined {
  return typeof value === 'number' ? value : undefined;
}

function parseEpisodeRow(row: EpisodeRow): UniversalImportItem | null {
  if (row.is_watched !== 'true') return null;

  const tvdbId = toInt(row.tvdb_id);
  if (tvdbId == null) return null;

  return {
    action: 'history',
    type: 'episode',
    ids: { tvdb: tvdbId },
    title: row.title || undefined,
    season: toInt(row.season),
    episode: toInt(row.episode),
    watched_at: toISOString(row.watched_at),
  };
}

function parseMovieRow(row: MovieRow): UniversalImportItem | null {
  if (row.is_watched !== 'true') return null;

  const tvdbId = toInt(row.tvdb_id);
  const imdbId = toImdb(row.imdb_id);
  if (tvdbId == null && !imdbId) return null;

  return {
    action: 'history',
    type: 'movie',
    ids: { tvdb: tvdbId, imdb: imdbId },
    title: row.title || undefined,
    year: toInt(row.year),
    watched_at: toISOString(row.watched_at),
  };
}

function parseSeriesRow(row: SeriesRow): UniversalImportItem | null {
  if (row.status !== WATCHLIST_SERIES_STATUS) return null;

  const tvdbId = toInt(row.tvdb_id);
  const imdbId = toImdb(row.imdb_id);
  if (tvdbId == null && !imdbId) return null;

  return {
    action: 'watchlist',
    type: 'show',
    ids: { tvdb: tvdbId, imdb: imdbId },
    title: row.title || undefined,
  };
}

// Custom lists carry no privacy flag in this export, so they import as private.
function parseListRow(row: ListRow): UniversalImportItem | null {
  const listName = row.list_name?.trim();
  const tvdbId = toInt(row.tvdb_id);
  if (!listName || tvdbId == null) return null;

  return {
    action: 'list',
    type: row.item_type === 'movie' ? 'movie' : 'show',
    ids: { tvdb: tvdbId },
    title: row.name || undefined,
    listName,
    listIsPublic: false,
  };
}

function parseCsvRows(
  basename: string,
  rows: Record<string, unknown>[],
): UniversalImportItem[] {
  if (basename.includes('lists')) {
    return rows
      .map((row) => parseListRow(row as ListRow))
      .filter((item): item is UniversalImportItem => item !== null);
  }
  // series-episodes must be checked before series (both start "tvtime-series").
  if (
    basename.includes('series-episodes') || 'series_tvdb_id' in (rows[0] ?? {})
  ) {
    return rows
      .map((row) => parseEpisodeRow(row as EpisodeRow))
      .filter((item): item is UniversalImportItem => item !== null);
  }
  if (basename.includes('movies')) {
    return rows
      .map((row) => parseMovieRow(row as MovieRow))
      .filter((item): item is UniversalImportItem => item !== null);
  }
  if (basename.includes('series')) {
    return rows
      .map((row) => parseSeriesRow(row as SeriesRow))
      .filter((item): item is UniversalImportItem => item !== null);
  }
  return [];
}

// The JSON series export nests every watch inside show -> seasons -> episodes.
function parseJsonShows(shows: JsonShow[]): UniversalImportItem[] {
  return shows.flatMap((show) => {
    if (!show) return [];
    const episodes = (show.seasons ?? []).flatMap((season) => {
      if (!season) return [];
      return (season.episodes ?? [])
        .filter((episode) => episode?.is_watched === true)
        .flatMap((episode): UniversalImportItem[] => {
          const tvdbId = toTvdb(episode?.id?.tvdb);
          if (tvdbId == null) return [];
          return [{
            action: 'history',
            type: 'episode',
            ids: { tvdb: tvdbId },
            title: show.title || undefined,
            season: season.number,
            episode: episode.number,
            watched_at: toISOString(episode.watched_at),
          }];
        });
    });

    if (show.status !== WATCHLIST_SERIES_STATUS) return episodes;

    const tvdbId = toTvdb(show.id?.tvdb);
    const imdbId = toImdb(show.id?.imdb);
    if (tvdbId == null && !imdbId) return episodes;

    return [...episodes, {
      action: 'watchlist',
      type: 'show',
      ids: { tvdb: tvdbId, imdb: imdbId },
      title: show.title || undefined,
    }];
  });
}

function parseJsonMovies(movies: JsonMovie[]): UniversalImportItem[] {
  return movies
    .filter((movie) => movie?.is_watched === true)
    .flatMap((movie): UniversalImportItem[] => {
      const tvdbId = toTvdb(movie.id?.tvdb);
      const imdbId = toImdb(movie.id?.imdb);
      if (tvdbId == null && !imdbId) return [];
      return [{
        action: 'history',
        type: 'movie',
        ids: { tvdb: tvdbId, imdb: imdbId },
        title: movie.title || undefined,
        year: movie.year,
        watched_at: toISOString(movie.watched_at),
      }];
    });
}

function parseJson(basename: string, text: string): UniversalImportItem[] {
  const data = (() => {
    try {
      return JSON.parse(text) as unknown;
    } catch {
      return null;
    }
  })();
  if (!Array.isArray(data)) return [];

  if (basename.includes('movies')) return parseJsonMovies(data as JsonMovie[]);
  if (basename.includes('series')) return parseJsonShows(data as JsonShow[]);
  return [];
}

type Entry = { basename: string; text: string };

function unzipExportTexts(buffer: ArrayBuffer): Entry[] {
  const isExportFile = (basename: string) =>
    basename.startsWith('tvtime-') &&
    (basename.endsWith('.csv') || basename.endsWith('.json'));

  try {
    return unzipCsvTexts({ buffer, isMatch: isExportFile });
  } catch {
    throw new Error(
      'Could not read the .zip file. If it is password protected, extract it first and upload the tvtime-*.csv files inside instead.',
    );
  }
}

async function collectEntries(files: ReadonlyArray<File>): Promise<Entry[]> {
  const entries = await Promise.all(files.map(async (file) => {
    if (file.name.endsWith('.zip')) {
      return unzipExportTexts(await file.arrayBuffer());
    }
    return [{ basename: file.name, text: await file.text() }];
  }));

  return entries.flat();
}

// A watch is identified by what it targets, not which file it came from, so
// the same episode/movie present in both the CSV and JSON exports collapses to
// one item.
function itemKey(item: UniversalImportItem): string {
  return [
    item.action,
    item.type,
    item.ids.tvdb ?? '',
    item.ids.imdb ?? '',
    item.season ?? '',
    item.episode ?? '',
  ].join('-');
}

function dedupeItems(
  items: ReadonlyArray<UniversalImportItem>,
): UniversalImportItem[] {
  const seen = new Map<string, UniversalImportItem>();
  for (const item of items) {
    const key = itemKey(item);
    const existing = seen.get(key);
    if (!existing) {
      seen.set(key, item);
      continue;
    }
    // The same watch can come from both formats with only one carrying the
    // timestamp; keep it rather than whichever we happened to see first.
    if (!existing.watched_at && item.watched_at) {
      seen.set(key, { ...existing, watched_at: item.watched_at });
    }
  }
  return Array.from(seen.values());
}

export const TvTimeExportParser: FileParser = {
  name: 'TV Time export',

  canParse(files) {
    return files.length > 0 &&
      files.every(
        (file) => file.name.endsWith('.csv') || file.name.endsWith('.zip'),
      );
  },

  async parse(files) {
    const entries = await collectEntries(files);

    const results = await Promise.all(entries.map(async (entry) => {
      if (entry.basename.endsWith('.csv')) {
        const rows = await parseCsvText(entry.text) as Record<
          string,
          unknown
        >[];
        return parseCsvRows(entry.basename, rows);
      }
      return parseJson(entry.basename, entry.text);
    }));

    return dedupeItems(results.flat());
  },
};
