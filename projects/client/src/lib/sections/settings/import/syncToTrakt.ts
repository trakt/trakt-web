import { api } from '$lib/requests/api.ts';
import { SYNC_CHUNK_SIZE } from '$lib/sections/settings/sync/constants/index.ts';
import { createSyncRunner } from '$lib/sections/settings/sync/createSyncRunner.ts';
import { chunk } from '$lib/utils/array/chunk.ts';
import type { SyncEngineCallbacks } from '../sync/models/SyncEngineCallbacks.ts';
import { buildHistoryPayload } from './engine/buildHistoryPayload.ts';
import { buildRatingsPayload } from './engine/buildRatingsPayload.ts';
import { buildWatchlistPayload } from './engine/buildWatchlistPayload.ts';
import { matchMovies } from './engine/matchMovies.ts';
import { resolveMovieIds } from './engine/resolveMovieIds.ts';
import { type SyncOutcome, toSyncOutcome } from './engine/toSyncOutcome.ts';
import { toUnsyncableItems } from './engine/toUnsyncableItems.ts';
import {
  DEFAULT_EPISODE_MATCH_MODE,
  type EpisodeMatchMode,
  type ImportSyncResult,
  type UniversalImportItem,
} from './ImportTypes.ts';

type SyncToTraktCallbacks = SyncEngineCallbacks & {
  onMatchProgress?: (processed: number, total: number) => void;
  episodeMatch?: EpisodeMatchMode;
};

type TraktClient = ReturnType<typeof api>;

type SyncResponse = { status: number; body: unknown };

type SyncActionParams<TPayload, TResponse> = {
  items: ReadonlyArray<UniversalImportItem>;
  buildPayload: (batch: ReadonlyArray<UniversalImportItem>) => TPayload;
  send: (payload: TPayload) => Promise<TResponse>;
};

type SyncAction = <TPayload, TResponse extends SyncResponse>(
  params: SyncActionParams<TPayload, TResponse>,
) => Promise<ReadonlyArray<SyncOutcome>>;

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

type SyncListsParams = {
  listItems: ReadonlyArray<UniversalImportItem>;
  client: TraktClient;
  syncAction: SyncAction;
  onError?: (message: string) => void;
};

// TV Time custom lists -> Trakt personal lists. Reuse an existing list with the
// same name so re-importing doesn't duplicate it; otherwise create it. Items
// are added with the watchlist (bulk media) payload shape.
async function syncLists(
  { listItems, client, syncAction, onError }: SyncListsParams,
): Promise<ReadonlyArray<SyncOutcome>> {
  const groups = groupByList(listItems);
  if (groups.size === 0) return [];

  const outcomes: SyncOutcome[] = [];

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
    outcomes.push(
      ...await syncAction({
        items,
        buildPayload: (batch) => buildWatchlistPayload([...batch]),
        send: (payload) =>
          client.users.lists.list.add({
            params: { id: 'me', list_id: listSlug },
            body: payload,
          }),
      }),
    );
  }

  return outcomes;
}

export async function syncToTrakt(
  items: ReadonlyArray<UniversalImportItem>,
  {
    onProgress,
    onError,
    onStart,
    onComplete,
    onMatchProgress,
    episodeMatch = DEFAULT_EPISODE_MATCH_MODE,
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

    const unsyncable = new Set(toUnsyncableItems(resolvedItems, episodeMatch));
    const unresolved = [...unsyncable].filter((item) =>
      !ambiguousItems.has(item)
    );

    const syncableItems = resolvedItems.filter((item) => !unsyncable.has(item));
    const historyItems = syncableItems.filter((i) => i.action === 'history');
    const watchlistItems = syncableItems.filter((i) =>
      i.action === 'watchlist'
    );
    const ratingItems = syncableItems.filter((i) => i.action === 'ratings');
    const listItems = syncableItems.filter((i) => i.action === 'list');

    const client = api();
    const { run, getErrorCount } = createSyncRunner({
      onProgress,
      onError,
      signal,
    });

    const syncAction: SyncAction = async (
      { items: actionItems, buildPayload, send },
    ) => {
      if (actionItems.length === 0) return [];

      const completed = await run(
        chunk(actionItems, SYNC_CHUNK_SIZE),
        buildPayload,
        send,
      );

      return completed.map(({ items: batch, response }) =>
        toSyncOutcome({
          items: batch,
          status: response.status,
          body: response.body,
        })
      );
    };

    const outcomes = [
      ...await syncAction({
        items: historyItems,
        buildPayload: (batch) => buildHistoryPayload([...batch], episodeMatch),
        send: (payload) => client.sync.history.add({ body: payload }),
      }),
      ...await syncAction({
        items: watchlistItems,
        buildPayload: (batch) => buildWatchlistPayload([...batch]),
        send: (payload) => client.sync.watchlist.add({ body: payload }),
      }),
      ...await syncAction({
        items: ratingItems,
        buildPayload: (batch) => buildRatingsPayload([...batch]),
        send: (payload) => client.sync.ratings.add({ body: payload }),
      }),
      ...await syncLists({ listItems, client, syncAction, onError }),
    ];

    const syncedCount = outcomes.reduce(
      (total, outcome) => total + outcome.synced,
      0,
    );
    const rejected = outcomes.flatMap((outcome) => outcome.rejected);

    onComplete?.(!signal?.aborted);
    return {
      syncedCount,
      errorCount: getErrorCount(),
      unresolved,
      rejected,
      ambiguous,
    };
  } catch (err) {
    onComplete?.(false);
    throw err;
  }
}
