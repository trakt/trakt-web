import { chunk } from '$lib/utils/array/chunk.ts';
import type {
  AmbiguousImportItem,
  ImportIds,
  UniversalImportItem,
} from '../ImportTypes.ts';
import type { MovieMatchQuery, MovieMatchResult } from './matchMovies.ts';

const MATCH_BATCH_SIZE = 500;

export type MatchMovies = (
  queries: ReadonlyArray<MovieMatchQuery>,
) => Promise<MovieMatchResult[]>;

type ResolveMovieIdsParams = {
  items: ReadonlyArray<UniversalImportItem>;
  match: MatchMovies;
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

// The match endpoint returns scheme-less poster paths (media.trakt.tv/...).
function toPosterUrl(poster?: string | null): string | undefined {
  if (!poster) return undefined;
  return poster.startsWith('http') ? poster : `https://${poster}`;
}

function toCandidates(
  result: MovieMatchResult,
): AmbiguousImportItem['candidates'] {
  return (result.candidates ?? []).map((candidate) => ({
    title: candidate.title,
    year: candidate.year ?? undefined,
    poster: toPosterUrl(candidate.poster),
    ids: {
      trakt: candidate.ids.trakt,
      imdb: candidate.ids.imdb ?? undefined,
      tmdb: candidate.ids.tmdb ?? undefined,
    },
  }));
}

export async function resolveMovieIds(
  { items, match, signal }: ResolveMovieIdsParams,
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

  const resultsByIndex = new Map<number, MovieMatchResult>();

  for (const batch of chunk([...queries.values()], MATCH_BATCH_SIZE)) {
    if (signal?.aborted) break;

    const results = await match(batch).catch(() => []);
    results.forEach((result) => resultsByIndex.set(result.index, result));
  }

  const ambiguous: AmbiguousImportItem[] = [];

  const resolved = items.map((item) => {
    if (!needsResolution(item)) return item;

    const query = queries.get(toQueryKey(item));
    const result = query && resultsByIndex.get(query.index);
    if (!result) return item;

    if (result.status === 'matched') {
      const ids = toImportIds(result);
      return ids ? { ...item, ids } : item;
    }

    if (result.status === 'ambiguous') {
      ambiguous.push({ item, candidates: toCandidates(result) });
    }

    return item;
  });

  return { items: resolved, ambiguous };
}
