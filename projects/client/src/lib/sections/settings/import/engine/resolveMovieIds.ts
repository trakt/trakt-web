import { chunk } from '$lib/utils/array/chunk.ts';
import { prependHttps } from '$lib/utils/url/prependHttps.ts';
import type {
  AmbiguousImportItem,
  ImportIds,
  UniversalImportItem,
} from '../ImportTypes.ts';
import type { MovieMatchQuery, MovieMatchResult } from './matchMovies.ts';

const MATCH_BATCH_SIZE = 100;

export type MatchMovies = (
  queries: ReadonlyArray<MovieMatchQuery>,
) => Promise<MovieMatchResult[]>;

type ResolveMovieIdsParams = {
  items: ReadonlyArray<UniversalImportItem>;
  match: MatchMovies;
  onProgress?: (processed: number, total: number) => void;
  signal?: AbortSignal;
};

export type ResolvedMovies = {
  items: UniversalImportItem[];
  ambiguous: AmbiguousImportItem[];
};

function hasAnyId(ids: ImportIds): boolean {
  return ids.trakt != null || ids.imdb != null || ids.tmdb != null ||
    ids.tvdb != null;
}

function needsResolution(item: UniversalImportItem): boolean {
  return item.type === 'movie' &&
    !hasAnyId(item.ids) &&
    Boolean(item.title);
}

function toQueryKey(item: UniversalImportItem): string {
  return `${item.title}:${item.year ?? ''}`;
}

function toImportIds(result: MovieMatchResult): ImportIds | undefined {
  const ids = result.match?.ids;
  if (!ids) return undefined;

  return {
    trakt: ids.trakt,
    imdb: ids.imdb ?? undefined,
    tmdb: ids.tmdb ?? undefined,
  };
}

function toCandidates(
  result: MovieMatchResult,
): AmbiguousImportItem['candidates'] {
  return (result.candidates ?? []).map((candidate) => ({
    title: candidate.title,
    year: candidate.year ?? undefined,
    // Match endpoint returns scheme-less poster paths (media.trakt.tv/...).
    poster: prependHttps(candidate.poster) ?? undefined,
    ids: {
      trakt: candidate.ids.trakt,
      imdb: candidate.ids.imdb ?? undefined,
      tmdb: candidate.ids.tmdb ?? undefined,
    },
  }));
}

export async function resolveMovieIds(
  { items, match, onProgress, signal }: ResolveMovieIdsParams,
): Promise<ResolvedMovies> {
  const queries = new Map<string, MovieMatchQuery>();

  items.filter(needsResolution).forEach((item) => {
    const key = toQueryKey(item);
    if (queries.has(key) || !item.title) return;

    queries.set(key, {
      index: queries.size,
      title: item.title,
      year: item.year,
    });
  });

  const total = queries.size;
  onProgress?.(0, total);

  const resultsByIndex = new Map<number, MovieMatchResult>();
  let processed = 0;

  for (const batch of chunk([...queries.values()], MATCH_BATCH_SIZE)) {
    if (signal?.aborted) break;

    const results = await match(batch).catch(() => []);
    results.forEach((result) => resultsByIndex.set(result.index, result));

    processed += batch.length;
    onProgress?.(processed, total);
  }

  const resultFor = (item: UniversalImportItem) => {
    if (!needsResolution(item)) return undefined;
    const query = queries.get(toQueryKey(item));
    return query ? resultsByIndex.get(query.index) : undefined;
  };

  const resolved = items.map((item) => {
    const result = resultFor(item);
    if (result?.status !== 'matched') return item;

    const ids = toImportIds(result);
    return ids ? { ...item, ids } : item;
  });

  const ambiguous = items.flatMap((item) => {
    const result = resultFor(item);
    return result?.status === 'ambiguous'
      ? [{ item, candidates: toCandidates(result) }]
      : [];
  });

  return { items: resolved, ambiguous };
}
