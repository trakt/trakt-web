import { api } from '$lib/requests/api.ts';
import { SYNC_CHUNK_SIZE } from '$lib/sections/settings/sync/constants/index.ts';
import { createSyncRunner } from '$lib/sections/settings/sync/createSyncRunner.ts';
import { chunk } from '$lib/utils/array/chunk.ts';
import type { SyncEngineCallbacks } from '../sync/models/SyncEngineCallbacks.ts';
import { NOOP_FN } from '$lib/utils/constants.ts';
import { buildFavoritesPayload } from './engine/buildFavoritesPayload.ts';
import { buildHistoryPayload } from './engine/buildHistoryPayload.ts';
import { buildRatingsPayload } from './engine/buildRatingsPayload.ts';
import { buildWatchlistPayload } from './engine/buildWatchlistPayload.ts';
import { findNotFoundItems } from './engine/findNotFoundItems.ts';
import { matchMovies } from './engine/matchMovies.ts';
import { matchShows } from './engine/matchShows.ts';
import { MOVIE_IDS, pickIds } from './engine/pickIds.ts';
import { resolveMovieIds } from './engine/resolveMovieIds.ts';
import { resolveShowIds } from './engine/resolveShowIds.ts';
import { toPositionalRetryItems } from './engine/toPositionalRetryItems.ts';
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
type SyncRunner = ReturnType<typeof createSyncRunner>['run'];

// Personal lists are few; one large page covers reuse-by-name lookup.
const ALL_LISTS_PAGE_SIZE = 1000;

type RunCollectingNotFoundParams<TPayload, TResponse> = {
  items: ReadonlyArray<UniversalImportItem>;
  run: SyncRunner;
  buildPayload: (batch: ReadonlyArray<UniversalImportItem>) => TPayload;
  sendRequest: (payload: TPayload) => Promise<TResponse>;
};

async function runCollectingNotFound<
  TPayload,
  TResponse extends { body?: unknown },
>({
  items,
  run,
  buildPayload,
  sendRequest,
}: RunCollectingNotFoundParams<TPayload, TResponse>): Promise<
  UniversalImportItem[]
> {
  const notFound: UniversalImportItem[] = [];

  await run(
    chunk(items, SYNC_CHUNK_SIZE),
    buildPayload,
    sendRequest,
    (response, batch) => {
      notFound.push(
        ...findNotFoundItems({ items: batch, body: response.body }),
      );
    },
  );

  return notFound;
}

interface ListGroup {
  isPublic: boolean;
  items: UniversalImportItem[];
}

function groupByList(
  listItems: ReadonlyArray<UniversalImportItem>,
): Map<string, ListGroup> {
  return listItems.reduce((groups, item) => {
    if (!item.listName) return groups;
    const group = groups.get(item.listName) ?? {
      isPublic: item.listIsPublic === true,
      items: [],
    };
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
): Promise<UniversalImportItem[]> {
  const groups = groupByList(listItems);
  if (groups.size === 0) return [];
  const notFound: UniversalImportItem[] = [];

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
    const listNotFound = await runCollectingNotFound({
      items,
      run,
      buildPayload: buildWatchlistPayload,
      sendRequest: (payload) =>
        client.users.lists.list.add({
          params: { id: 'me', list_id: listSlug },
          body: payload,
        }),
    });
    notFound.push(...listNotFound);
  }

  return notFound;
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
    const { items: movieResolvedItems, ambiguous } = await resolveMovieIds({
      items,
      match: matchMovies,
      onProgress: onMatchProgress,
      signal,
    });

    const { items: resolvedItems, unresolved: unresolvedShows } =
      await resolveShowIds({
        items: movieResolvedItems,
        match: matchShows,
        onProgress: onMatchProgress,
        signal,
      });

    const ambiguousItems = new Set(ambiguous.map((entry) => entry.item));
    const unresolvedMovies = resolvedItems.filter(
      (item) =>
        item.type === 'movie' &&
        !pickIds(item.ids, MOVIE_IDS) &&
        !ambiguousItems.has(item),
    );
    const unresolved = [...unresolvedMovies, ...unresolvedShows];

    const historyItems = resolvedItems.filter((i) => i.action === 'history');
    const watchlistItems = resolvedItems.filter(
      (i) => i.action === 'watchlist',
    );
    const ratingItems = resolvedItems.filter((i) => i.action === 'ratings');
    const listItems = resolvedItems.filter((i) => i.action === 'list');
    const favoriteItems = resolvedItems.filter((i) => i.action === 'favorites');

    const client = api();
    const { run, getErrorCount } = createSyncRunner({
      onProgress,
      onError,
      signal,
    });
    const { run: retryRun, getErrorCount: getRetryErrorCount } =
      createSyncRunner({ onProgress: NOOP_FN, onError, signal });

    const historyNotFound = await runCollectingNotFound({
      items: historyItems,
      run,
      buildPayload: (batch) => buildHistoryPayload(batch, episodeMatch),
      sendRequest: (payload) => client.sync.history.add({ body: payload }),
    });

    const retryItems = new Set(
      toPositionalRetryItems({ items: historyNotFound, episodeMatch }),
    );
    const retriedNotFound = await runCollectingNotFound({
      items: [...retryItems],
      run: retryRun,
      buildPayload: (batch) => buildHistoryPayload(batch, 'positional'),
      sendRequest: (payload) => client.sync.history.add({ body: payload }),
    });

    const watchlistNotFound = await runCollectingNotFound({
      items: watchlistItems,
      run,
      buildPayload: buildWatchlistPayload,
      sendRequest: (payload) => client.sync.watchlist.add({ body: payload }),
    });

    const ratingsNotFound = await runCollectingNotFound({
      items: ratingItems,
      run,
      buildPayload: buildRatingsPayload,
      sendRequest: (payload) => client.sync.ratings.add({ body: payload }),
    });

    const listsNotFound = await syncLists(listItems, client, run, onError);

    const favoritesNotFound = await runCollectingNotFound({
      items: favoriteItems,
      run,
      buildPayload: buildFavoritesPayload,
      sendRequest: (payload) => client.sync.favorites.add({ body: payload }),
    });

    const notFound = [
      ...historyNotFound.filter((item) => !retryItems.has(item)),
      ...retriedNotFound,
      ...watchlistNotFound,
      ...ratingsNotFound,
      ...listsNotFound,
      ...favoritesNotFound,
    ];

    onComplete?.(!signal?.aborted);
    return {
      errorCount: getErrorCount() + getRetryErrorCount(),
      unresolved: [...unresolved, ...notFound],
      ambiguous,
    };
  } catch (err) {
    onComplete?.(false);
    throw err;
  }
}
