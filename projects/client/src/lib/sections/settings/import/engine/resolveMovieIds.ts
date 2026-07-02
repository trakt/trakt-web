import { chunk } from '$lib/utils/array/chunk.ts';
import type { ImportIds, UniversalImportItem } from '../ImportTypes.ts';
import type { MovieCandidate } from './searchMovieCandidates.ts';

const SEARCH_CONCURRENCY = 4;

// Release years differ by one between sources for festival or
// end-of-year releases (e.g. Schindler's List 1993 vs 1994).
const YEAR_TOLERANCE = 1;

export type SearchMovieCandidates = (
  title: string,
) => Promise<MovieCandidate[]>;

type ResolveMovieIdsParams = {
  items: ReadonlyArray<UniversalImportItem>;
  search: SearchMovieCandidates;
  signal?: AbortSignal;
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

function pickCandidate(
  candidates: MovieCandidate[],
  year?: number,
): MovieCandidate | undefined {
  if (year == null) return candidates.at(0);

  return candidates.find(
    (candidate) =>
      candidate.year != null &&
      Math.abs(candidate.year - year) <= YEAR_TOLERANCE,
  );
}

export async function resolveMovieIds(
  { items, search, signal }: ResolveMovieIdsParams,
): Promise<UniversalImportItem[]> {
  const titles = [
    ...new Set(
      items
        .filter(needsResolution)
        .map((item) => item.title)
        .filter((title): title is string => Boolean(title)),
    ),
  ];

  const candidatesByTitle = new Map<string, MovieCandidate[]>();

  for (const batch of chunk(titles, SEARCH_CONCURRENCY)) {
    if (signal?.aborted) break;

    await Promise.all(batch.map(async (title) => {
      const candidates = await search(title).catch(() => []);
      candidatesByTitle.set(title, candidates);
    }));
  }

  return items.map((item) => {
    if (!needsResolution(item) || !item.title) return item;

    const candidates = candidatesByTitle.get(item.title) ?? [];
    const match = pickCandidate(candidates, item.year);

    return match && hasAnyId(match.ids) ? { ...item, ids: match.ids } : item;
  });
}
