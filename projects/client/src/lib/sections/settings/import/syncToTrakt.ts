import { api } from '$lib/requests/api.ts';
import { SYNC_CHUNK_SIZE } from '$lib/sections/settings/sync/constants/index.ts';
import { createSyncRunner } from '$lib/sections/settings/sync/createSyncRunner.ts';
import { chunk } from '$lib/utils/array/chunk.ts';
import type { SyncEngineCallbacks } from '../sync/models/SyncEngineCallbacks.ts';
import { buildHistoryPayload } from './engine/buildHistoryPayload.ts';
import { buildRatingsPayload } from './engine/buildRatingsPayload.ts';
import { buildWatchlistPayload } from './engine/buildWatchlistPayload.ts';
import { matchMovies } from './engine/matchMovies.ts';
import { MOVIE_IDS, pickIds } from './engine/pickIds.ts';
import { resolveMovieIds } from './engine/resolveMovieIds.ts';
import type { ImportSyncResult, UniversalImportItem } from './ImportTypes.ts';

type SyncToTraktCallbacks = SyncEngineCallbacks & {
  onMatchProgress?: (processed: number, total: number) => void;
};

type TraktClient = ReturnType<typeof api>;
type SyncRunner = ReturnType<typeof createSyncRunner>['run'];

// Personal lists are few; one large page covers reuse-by-name lookup.
const ALL_LISTS_PAGE_SIZE = 1000;

interface ListGroup {
  isPublic: boolean;
  items: UniversalImportItem[];
}

function groupByList(
  listItems: ReadonlyArray<UniversalImportItem>,
): Map<string, ListGroup> {
  return listItems.reduce((groups, item) => {
    if (!item.listName) return groups;
    const group = groups.get(item.listName) ??
      { isPublic: item.listIsPublic === true, items: [] };
    return groups.set(item.listName, {
      ...group,
      items: [...group.items, item],
    });
  }, new Map<string, ListGroup>());
}

// TV Time custom lists -> Trakt personal lists. Reuse an existing list with the
// same name so re-importing doesn't duplicate it; otherwise create it. Items
// are added with the watchlist (bulk media) payload shape.
async function syncLists(
  listItems: ReadonlyArray<UniversalImportItem>,
  client: TraktClient,
  run: SyncRunner,
  onError?: (message: string) => void,
): Promise<void> {
  const groups = groupByList(listItems);
  if (groups.size === 0) return;

  const slugByName = new Map<string, string>();
  try {
    const existing = await client.users.lists.personal({
      params: { id: 'me' },
      query: { limit: ALL_LISTS_PAGE_SIZE, page: 1 },
    });
    if (existing.status === 200 && existing.body) {
      for (const list of existing.body) {
        slugByName.set(list.name, list.ids.slug);
      }
    } else {
      onError?.(`Failed to fetch existing lists (status ${existing.status})`);
    }
  } catch (error) {
    onError?.(error instanceof Error ? error.message : String(error));
  }

  for (const [name, { isPublic, items }] of groups) {
    let slug = slugByName.get(name);

    if (!slug) {
      try {
        const created = await client.users.lists.create({
          params: { id: 'me' },
          body: { name, privacy: isPublic ? 'public' : 'private' },
        });
        if (created.status !== 201 || !created.body?.ids?.slug) {
          onError?.(`Failed to create list "${name}"`);
          continue;
        }
        slug = created.body.ids.slug;
      } catch (error) {
        onError?.(error instanceof Error ? error.message : String(error));
        continue;
      }
    }

    const listSlug = slug;
    await run(
      chunk(items, SYNC_CHUNK_SIZE),
      (batch) => buildWatchlistPayload([...batch]),
      (payload) =>
        client.users.lists.list.add({
          params: { id: 'me', list_id: listSlug },
          body: payload,
        }),
    );
  }
}

export async function syncToTrakt(
  items: ReadonlyArray<UniversalImportItem>,
  {
    onProgress,
    onError,
    onStart,
    onComplete,
    onMatchProgress,
    signal,
  }: SyncToTraktCallbacks,
): Promise<ImportSyncResult> {
  onStart?.();

  try {
    const { items: resolvedItems, ambiguous } = await resolveMovieIds({
      items,
      match: matchMovies,
      onProgress: onMatchProgress,
      signal,
    });

    const ambiguousItems = new Set(ambiguous.map((entry) => entry.item));
    const unresolved = resolvedItems.filter(
      (item) =>
        item.type === 'movie' &&
        !pickIds(item.ids, MOVIE_IDS) &&
        !ambiguousItems.has(item),
    );

    const historyItems = resolvedItems.filter((i) => i.action === 'history');
    const watchlistItems = resolvedItems.filter((i) =>
      i.action === 'watchlist'
    );
    const ratingItems = resolvedItems.filter((i) => i.action === 'ratings');
    const listItems = resolvedItems.filter((i) => i.action === 'list');

    const client = api();
    const { run, getErrorCount } = createSyncRunner({
      onProgress,
      onError,
      signal,
    });

    if (historyItems.length > 0) {
      await run(
        chunk(historyItems, SYNC_CHUNK_SIZE),
        (batch) => buildHistoryPayload([...batch]),
        (payload) => client.sync.history.add({ body: payload }),
      );
    }

    if (watchlistItems.length > 0) {
      await run(
        chunk(watchlistItems, SYNC_CHUNK_SIZE),
        (batch) => buildWatchlistPayload([...batch]),
        (payload) => client.sync.watchlist.add({ body: payload }),
      );
    }

    if (ratingItems.length > 0) {
      await run(
        chunk(ratingItems, SYNC_CHUNK_SIZE),
        (batch) => buildRatingsPayload([...batch]),
        (payload) => client.sync.ratings.add({ body: payload }),
      );
    }

    if (listItems.length > 0) {
      await syncLists(listItems, client, run, onError);
    }

    onComplete?.(!signal?.aborted);
    return { errorCount: getErrorCount(), unresolved, ambiguous };
  } catch (err) {
    onComplete?.(false);
    throw err;
  }
}
