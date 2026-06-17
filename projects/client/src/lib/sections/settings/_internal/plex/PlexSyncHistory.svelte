<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import { useInfiniteQuery } from "$lib/features/query/useQuery.ts";
  import type { DataSync } from "$lib/requests/models/DataSync.ts";
  import { InvalidateAction } from "$lib/requests/models/InvalidateAction.ts";
  import type { PlexSync } from "$lib/requests/plex/plexDataSyncsQuery.ts";
  import { plexDataSyncsQuery } from "$lib/requests/plex/plexDataSyncsQuery.ts";
  import { plexUndoSyncRequest } from "$lib/requests/plex/plexUndoSyncRequest.ts";
  import { useInvalidator } from "$lib/stores/useInvalidator.ts";
  import { firstValueFrom, map } from "rxjs";
  import DataSyncList from "../DataSyncList.svelte";
  import SettingsSectionLabel from "../SettingsSectionLabel.svelte";

  const { invalidate } = useInvalidator();

  const syncsResult = useInfiniteQuery(plexDataSyncsQuery());

  const syncs = syncsResult.pipe(
    map((q) => (q.data?.pages.flatMap((p) => p.entries) ?? []).map(toDataSync)),
  );

  const hasNextPage = syncsResult.pipe(map((q) => Boolean(q.hasNextPage)));
  const isFetchingNextPage = syncsResult.pipe(map((q) => q.isFetchingNextPage));

  const fetchNextPage = async () => {
    const q = await firstValueFrom(syncsResult);
    await q.fetchNextPage();
  };

  function toDataSync(sync: PlexSync): DataSync {
    return {
      id: sync.id,
      key: sync.key,
      createdAt: sync.createdAt,
      kind: "plex",
      source: null,
      application: null,
      isUndone: sync.undone,
      undoneAt: sync.undoneAt,
      items: {
        history: sync.items.history ?? null,
        library: sync.items.library ?? null,
        ratings: sync.items.ratings ?? null,
        watchlist: sync.items.watchlist ?? null,
      },
      pausedCount: sync.pausedCount,
      skippedCount: sync.skippedCount,
    };
  }

  function getOnUndo(id: number) {
    return async () => {
      await plexUndoSyncRequest({ syncId: id });
      await invalidate(InvalidateAction.Plex.Syncs);
    };
  }
</script>

{#if ($syncs ?? []).length > 0}
  <SettingsSectionLabel title={m.header_plex_sync_history()} />
  <div class="trakt-plex-sync-list">
    <DataSyncList
      syncs={$syncs ?? []}
      hasNextPage={$hasNextPage}
      isFetchingNextPage={$isFetchingNextPage}
      onLoadMore={fetchNextPage}
      {getOnUndo}
    />
  </div>
{/if}

<style>
  .trakt-plex-sync-list {
    max-width: var(--ni-640);

    display: flex;
    flex-direction: column;
    gap: var(--gap-s);
  }
</style>
