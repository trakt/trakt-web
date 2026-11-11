import { chunk } from '$lib/utils/array/chunk.ts';
import type { UniversalImportItem } from '../ImportTypes.ts';
import type {
  ShowMatchCandidate,
  ShowMatchQuery,
  ShowMatchResult,
} from './matchShows.ts';
import { pickIds, toEpisodeIdPriority } from './pickIds.ts';

const SHOW_LOOKUP_CONCURRENCY = 5;

export type MatchShows = (
  queries: ReadonlyArray<ShowMatchQuery>,
) => Promise<ShowMatchResult[]>;

type ResolveShowIdsParams = {
  items: ReadonlyArray<UniversalImportItem>;
  match: MatchShows;
  onProgress?: (processed: number, total: number) => void;
  signal?: AbortSignal;
};

export type ResolvedShows = {
  items: UniversalImportItem[];
  unresolved: UniversalImportItem[];
};

function needsResolution(item: UniversalImportItem): boolean {
  return (
    item.type === 'episode' &&
    Boolean(item.title) &&
    item.season != null &&
    item.episode != null &&
    item.showTvdb == null &&
    item.showImdb == null &&
    pickIds(item.ids, toEpisodeIdPriority(item)) == null
  );
}

function normalizeTitle(title: string): string {
  return title
    .normalize('NFKD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim();
}

function toQueryKey(item: UniversalImportItem): string {
  return `${normalizeTitle(item.title ?? '')}:${item.year ?? ''}`;
}

function pickUnambiguousShow(
  { title, year }: ShowMatchQuery,
  candidates: ReadonlyArray<ShowMatchCandidate>,
): ShowMatchCandidate | undefined {
  const sameTitle = candidates.filter(
    (candidate) => normalizeTitle(candidate.title) === normalizeTitle(title),
  );
  const sameYear =
    year == null
      ? sameTitle
      : sameTitle.filter((candidate) => candidate.year === year);

  const [only] = sameYear;
  if (sameYear.length !== 1 || !only) return undefined;
  if (only.tvdb == null && only.imdb == null) return undefined;

  return only;
}

export async function resolveShowIds({
  items,
  match,
  onProgress,
  signal,
}: ResolveShowIdsParams): Promise<ResolvedShows> {
  const queries = new Map<string, ShowMatchQuery>();

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

  const showsByIndex = new Map<number, ShowMatchCandidate>();
  let processed = 0;

  for (const batch of chunk([...queries.values()], SHOW_LOOKUP_CONCURRENCY)) {
    if (signal?.aborted) break;

    const results = await match(batch).catch(() => []);
    results.forEach((result) => {
      const query = batch.find(({ index }) => index === result.index);
      const show = query && pickUnambiguousShow(query, result.candidates);
      if (show) showsByIndex.set(result.index, show);
    });

    processed += batch.length;
    onProgress?.(processed, total);
  }

  const resolved = items.map((item) => {
    if (!needsResolution(item)) return item;

    const query = queries.get(toQueryKey(item));
    const show = query && showsByIndex.get(query.index);
    if (!show) return item;

    return {
      ...item,
      ...(show.tvdb != null ? { showTvdb: show.tvdb } : {}),
      ...(show.imdb != null ? { showImdb: show.imdb } : {}),
    };
  });

  return { items: resolved, unresolved: resolved.filter(needsResolution) };
}
