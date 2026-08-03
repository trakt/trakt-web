import type {
  ImportIds,
  ImportType,
  UniversalImportItem,
} from '../ImportTypes.ts';
import { ALL_IDS } from './pickIds.ts';

type ToSyncOutcomeParams = {
  items: ReadonlyArray<UniversalImportItem>;
  status: number;
  body: unknown;
};

export type SyncOutcome = {
  synced: number;
  rejected: ReadonlyArray<UniversalImportItem>;
};

const SYNCED_BUCKETS = ['added', 'updated', 'existing'] as const;

const NOT_FOUND_BUCKETS = ['movies', 'shows', 'seasons', 'episodes'] as const;

type NotFoundBucket = typeof NOT_FOUND_BUCKETS[number];

const NOT_FOUND_TYPES: Readonly<
  Record<NotFoundBucket, ReadonlyArray<ImportType>>
> = {
  movies: ['movie'],
  shows: ['show', 'episode'],
  seasons: ['episode'],
  episodes: ['episode'],
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function sumCounts(bucket: unknown): number {
  if (!isRecord(bucket)) return 0;

  return Object.values(bucket)
    .filter((value): value is number => typeof value === 'number')
    .reduce((total, value) => total + value, 0);
}

function toSyncedCount(body: unknown): number {
  if (!isRecord(body)) return 0;

  return SYNCED_BUCKETS.reduce(
    (total, bucket) => total + sumCounts(body[bucket]),
    0,
  );
}

function toNotFoundEntries(
  body: unknown,
  bucket: NotFoundBucket,
): ReadonlyArray<Record<string, unknown>> {
  if (!isRecord(body) || !isRecord(body.not_found)) return [];

  const entries = body.not_found[bucket];
  if (!Array.isArray(entries)) return [];

  return entries.filter(isRecord);
}

function toMatchableIds(
  item: UniversalImportItem,
  bucket: NotFoundBucket,
): ImportIds {
  if (bucket !== 'shows' || item.type === 'show') return item.ids;
  return { tvdb: item.showTvdb, imdb: item.showImdb };
}

function hasSharedId(
  ids: ImportIds,
  entry: Record<string, unknown>,
): boolean {
  const entryIds = isRecord(entry.ids) ? entry.ids : {};

  return ALL_IDS.some((key) => {
    const value = ids[key];
    return value != null && entryIds[key] === value;
  });
}

function hasSharedTitle(
  item: UniversalImportItem,
  entry: Record<string, unknown>,
): boolean {
  return item.title != null &&
    entry.title === item.title &&
    entry.year === item.year;
}

function toRejectedItems(
  items: ReadonlyArray<UniversalImportItem>,
  body: unknown,
): ReadonlyArray<UniversalImportItem> {
  const rejected = NOT_FOUND_BUCKETS.flatMap((bucket) => {
    const entries = toNotFoundEntries(body, bucket);
    if (entries.length === 0) return [];

    return items.filter((item) =>
      NOT_FOUND_TYPES[bucket].includes(item.type) &&
      entries.some((entry) =>
        hasSharedId(toMatchableIds(item, bucket), entry) ||
        hasSharedTitle(item, entry)
      )
    );
  });

  return [...new Set(rejected)];
}

export function toSyncOutcome(
  { items, status, body }: ToSyncOutcomeParams,
): SyncOutcome {
  if (status < 200 || status >= 300) return { synced: 0, rejected: items };

  return {
    synced: toSyncedCount(body),
    rejected: toRejectedItems(items, body),
  };
}
