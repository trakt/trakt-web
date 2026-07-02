import { unzipSync } from 'fflate';
import type { UniversalImportItem } from '../ImportTypes.ts';
import type { FileParser } from './ParserInterface.ts';
import { parseCsvText } from './utils/parseCsvText.ts';
import { toISOString } from './utils/toISOString.ts';

type TrackingV1Row = {
  type?: string;
  entity_type?: string;
  series_name?: string;
  movie_name?: string;
  release_date?: string;
  alpha_range_key?: string;
  season_number?: string;
  episode_number?: string;
  episode_id?: string;
  watch_date_range_key?: string;
  created_at?: string;
};

type TrackingV2Row = {
  key?: string;
  created_at?: string;
  s_id?: string;
  series_name?: string;
  season_number?: string;
  episode_number?: string;
  episode_id?: string;
  is_followed?: string;
  is_for_later?: string;
  is_archived?: string;
};

const TRACKING_V1_MARKER = 'type-uuid-n';
const TRACKING_V2_MARKER = 'ep_id';

function toInt(value?: string): number | undefined {
  if (!value) return undefined;
  const n = parseInt(value, 10);
  return isNaN(n) ? undefined : n;
}

// TV Time stores unknown release dates as the Go zero time (0001-01-01).
function toYear(releaseDate?: string): number | undefined {
  const year = toInt(releaseDate?.slice(0, 4));
  return year != null && year >= 1888 ? year : undefined;
}

// TV Time slugs are English regardless of the localized movie_name,
// so they match Trakt titles better (e.g. 승리호 -> "space sweepers").
function toMovieTitle(row: TrackingV1Row): string | undefined {
  const slug = row.alpha_range_key?.replace(`${row.type}-alpha-`, '');
  const title = slug?.replaceAll('-', ' ').trim();
  return title || row.movie_name || undefined;
}

function toWatchedAt(row: TrackingV1Row): string | undefined {
  const [, epoch] = row.watch_date_range_key?.match(/watch-date-(\d+)/) ?? [];
  if (epoch) return new Date(Number(epoch) * 1000).toISOString();
  return toISOString(row.created_at);
}

function parseV1Movie(row: TrackingV1Row): UniversalImportItem | null {
  const title = toMovieTitle(row);
  const year = toYear(row.release_date);
  if (!title || !year) return null;

  const base = { type: 'movie' as const, ids: {}, title, year };

  if (row.type === 'watch') {
    return { ...base, action: 'history', watched_at: toWatchedAt(row) };
  }

  if (row.type === 'towatch') {
    return { ...base, action: 'watchlist' };
  }

  return null;
}

function parseV1Episode(row: TrackingV1Row): UniversalImportItem | null {
  if (row.type !== 'watch') return null;

  const tvdbId = toInt(row.episode_id);
  if (tvdbId == null) return null;

  return {
    action: 'history',
    type: 'episode',
    ids: { tvdb: tvdbId },
    title: row.series_name || undefined,
    season: toInt(row.season_number),
    episode: toInt(row.episode_number),
    watched_at: toWatchedAt(row),
  };
}

function parseV2Episode(row: TrackingV2Row): UniversalImportItem | null {
  if (!row.key?.startsWith('watch-episode-')) return null;

  const tvdbId = toInt(row.episode_id);
  if (tvdbId == null) return null;

  return {
    action: 'history',
    type: 'episode',
    ids: { tvdb: tvdbId },
    title: row.series_name || undefined,
    season: toInt(row.season_number),
    episode: toInt(row.episode_number),
    watched_at: toISOString(row.created_at),
  };
}

function parseV2ShowWatchlist(
  rows: TrackingV2Row[],
  watchedShowIds: ReadonlySet<number>,
): UniversalImportItem[] {
  return rows
    .filter((row) => row.key?.startsWith('user-series-'))
    .filter((row) => row.is_archived !== 'true')
    .filter((row) =>
      row.is_for_later === 'true' ||
      (row.is_followed === 'true' &&
        !watchedShowIds.has(toInt(row.s_id) ?? -1))
    )
    .flatMap((row) => {
      const tvdbId = toInt(row.s_id);
      if (tvdbId == null) return [];

      return [{
        action: 'watchlist' as const,
        type: 'show' as const,
        ids: { tvdb: tvdbId },
        title: row.series_name || undefined,
      }];
    });
}

function parseGdprRows(
  { v1Rows, v2Rows }: { v1Rows: TrackingV1Row[]; v2Rows: TrackingV2Row[] },
): UniversalImportItem[] {
  const episodes = v2Rows.length > 0
    ? v2Rows
      .map(parseV2Episode)
      .filter((item): item is UniversalImportItem => item !== null)
    : v1Rows
      .filter((row) => row.entity_type === 'episode')
      .map(parseV1Episode)
      .filter((item): item is UniversalImportItem => item !== null);

  const movies = v1Rows
    .filter((row) => row.entity_type === 'movie')
    .map(parseV1Movie)
    .filter((item): item is UniversalImportItem => item !== null);

  const watchedShowIds = new Set(
    v2Rows
      .filter((row) => row.key?.startsWith('watch-episode-'))
      .map((row) => toInt(row.s_id))
      .filter((id): id is number => id != null),
  );

  const showWatchlist = parseV2ShowWatchlist(v2Rows, watchedShowIds);

  return [...episodes, ...movies, ...showWatchlist];
}

function isV1Row(row: Record<string, unknown>): boolean {
  return TRACKING_V1_MARKER in row;
}

function isV2Row(row: Record<string, unknown>): boolean {
  return TRACKING_V2_MARKER in row;
}

function unzipTrackingCsvTexts(buffer: ArrayBuffer): string[] {
  const isTrackingCsv = (filename: string) => {
    const basename = filename.split('/').at(-1) ?? '';
    return basename.startsWith('tracking-prod-records') &&
      basename.endsWith('.csv');
  };

  const unzipped = (() => {
    try {
      return unzipSync(new Uint8Array(buffer), {
        filter: (file) => isTrackingCsv(file.name),
      });
    } catch {
      throw new Error(
        'Could not read the .zip file. If it is password protected, extract it first and upload the tracking-prod-records CSV files instead.',
      );
    }
  })();

  const decoder = new TextDecoder('utf-8');
  return Object.values(unzipped).map((data) => decoder.decode(data));
}

async function collectCsvTexts(files: ReadonlyArray<File>): Promise<string[]> {
  const texts = await Promise.all(files.map(async (file) => {
    if (file.name.endsWith('.zip')) {
      return unzipTrackingCsvTexts(await file.arrayBuffer());
    }
    return [await file.text()];
  }));

  return texts.flat();
}

export const TvTimeGdprParser: FileParser = {
  name: 'TV Time GDPR',

  canParse(files) {
    return files.length > 0 &&
      files.every(
        (file) => file.name.endsWith('.csv') || file.name.endsWith('.zip'),
      );
  },

  async parse(files) {
    const texts = await collectCsvTexts(files);
    const parsed = await Promise.all(texts.map(parseCsvText));

    const v1Rows: TrackingV1Row[] = [];
    const v2Rows: TrackingV2Row[] = [];

    for (const rows of parsed as Record<string, unknown>[][]) {
      const [first] = rows;
      if (!first) continue;
      if (isV2Row(first)) v2Rows.push(...(rows as TrackingV2Row[]));
      else if (isV1Row(first)) v1Rows.push(...(rows as TrackingV1Row[]));
    }

    return parseGdprRows({ v1Rows, v2Rows });
  },
};
