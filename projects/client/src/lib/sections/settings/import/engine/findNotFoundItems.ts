import { z } from 'zod';
import type { ImportIds, UniversalImportItem } from '../ImportTypes.ts';

const notFoundEntrySchema = z.object({
  ids: z.record(z.string(), z.unknown()).nullish(),
  title: z.string().nullish(),
  year: z.number().nullish(),
  seasons: z
    .array(
      z.object({
        number: z.number(),
        episodes: z.array(z.object({ number: z.number() })).nullish(),
      }),
    )
    .nullish(),
});

const notFoundBodySchema = z.object({
  not_found: z
    .object({
      movies: z.array(notFoundEntrySchema).nullish(),
      shows: z.array(notFoundEntrySchema).nullish(),
      seasons: z.array(notFoundEntrySchema).nullish(),
      episodes: z.array(notFoundEntrySchema).nullish(),
    })
    .nullish(),
});

type NotFoundEntry = z.infer<typeof notFoundEntrySchema>;

type FindNotFoundItemsParams = {
  items: ReadonlyArray<UniversalImportItem>;
  body: unknown;
};

function hasSharedId(
  itemIds: ImportIds,
  entryIds: NotFoundEntry['ids'],
): boolean {
  const own = new Map<string, unknown>(Object.entries(itemIds));

  return Object.entries(entryIds ?? {}).some(
    ([key, value]) => value != null && own.get(key) === value,
  );
}

function isPositionalEntry(entry: NotFoundEntry): boolean {
  return (entry.seasons?.length ?? 0) > 0;
}

function isShowEntryFor(
  item: UniversalImportItem,
  entry: NotFoundEntry,
): boolean {
  if (hasSharedId(item.ids, entry.ids)) return true;
  return (
    entry.title != null &&
    entry.title === item.title &&
    (entry.year ?? undefined) === item.year
  );
}

function isPositionalEntryFor(
  item: UniversalImportItem,
  entry: NotFoundEntry,
): boolean {
  const showIds: ImportIds = { tvdb: item.showTvdb, imdb: item.showImdb };
  if (!hasSharedId(showIds, entry.ids)) return false;

  return (entry.seasons ?? []).some(
    (season) =>
      season.number === item.season &&
      (season.episodes ?? []).some(({ number }) => number === item.episode),
  );
}

function isNotFound(
  item: UniversalImportItem,
  notFound: NonNullable<z.infer<typeof notFoundBodySchema>['not_found']>,
): boolean {
  const matchesIds = (
    entries: ReadonlyArray<NotFoundEntry> | null | undefined,
  ) => (entries ?? []).some((entry) => hasSharedId(item.ids, entry.ids));

  switch (item.type) {
    case 'movie':
      return matchesIds(notFound.movies);
    case 'season':
      return matchesIds(notFound.seasons);
    case 'show':
      return (notFound.shows ?? [])
        .filter((entry) => !isPositionalEntry(entry))
        .some((entry) => isShowEntryFor(item, entry));
    case 'episode':
      return (
        matchesIds(notFound.episodes) ||
        (notFound.shows ?? [])
          .filter(isPositionalEntry)
          .some((entry) => isPositionalEntryFor(item, entry))
      );
  }
}

export function findNotFoundItems({
  items,
  body,
}: FindNotFoundItemsParams): UniversalImportItem[] {
  const parsed = notFoundBodySchema.safeParse(body);
  const notFound = parsed.success ? parsed.data.not_found : null;
  if (!notFound) return [];

  return items.filter((item) => isNotFound(item, notFound));
}
