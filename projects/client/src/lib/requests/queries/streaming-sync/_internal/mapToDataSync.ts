import type { DataSync, SyncCounts } from '$lib/requests/models/DataSync.ts';
import type { SyncResponse } from '@trakt/api';

function mapCounts(counts: SyncResponse['items']['history']): SyncCounts {
  return {
    movies: counts?.movies,
    episodes: counts?.episodes,
    shows: counts?.shows,
    seasons: counts?.seasons,
  };
}

export function mapToDataSync(sync: SyncResponse): DataSync {
  return {
    id: sync.id,
    key: `data-sync-${sync.id}`,
    createdAt: new Date(sync.created_at),
    kind: sync.kind,
    source: sync.source,
    application: sync.application,
    isUndone: sync.undone,
    undoneAt: sync.undone_at ? new Date(sync.undone_at) : undefined,
    items: {
      history: mapCounts(sync.items?.history),
      library: mapCounts(sync.items?.library),
      ratings: mapCounts(sync.items?.ratings),
      watchlist: mapCounts(sync.items?.watchlist),
    },
    pausedCount: sync.paused_count,
    skippedCount: sync.skipped_count,
  };
}
