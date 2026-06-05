<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { useInfiniteQuery } from "$lib/features/query/useQuery.ts";
  import { syncPausedItemsQuery } from "$lib/requests/queries/streaming-sync/syncPausedItemsQuery.ts";
  import { syncSkippedItemsQuery } from "$lib/requests/queries/streaming-sync/syncSkippedItemsQuery.ts";
  import { firstValueFrom, map } from "rxjs";
  import SettingsBlock from "../SettingsBlock.svelte";
  import SyncItemRow from "./SyncItemRow.svelte";
  import SyncLoadError from "./SyncLoadError.svelte";
  import { toServiceInfo } from "./toServiceInfo.ts";
  import { useStreamingServiceLookup } from "./useStreamingServiceLookup.ts";

  type SyncItemsSectionProps = {
    syncId: number;
    kind: "paused" | "skipped";
    count: number;
  };

  const { syncId, kind, count }: SyncItemsSectionProps = $props();

  const PAGE_SIZE = 20;

  const { lookup } = useStreamingServiceLookup();

  const query = $derived(
    useInfiniteQuery(
      kind === "paused"
        ? syncPausedItemsQuery({ id: syncId, limit: PAGE_SIZE })
        : syncSkippedItemsQuery({ id: syncId, limit: PAGE_SIZE }),
    ),
  );

  const items = $derived(
    query.pipe(
      map((queryState) =>
        queryState.data?.pages.flatMap((page) => page.entries) ?? []
      ),
    ),
  );
  const hasNextPage = $derived(
    query.pipe(map((queryState) => Boolean(queryState.hasNextPage))),
  );
  const isFetchingNextPage = $derived(
    query.pipe(map((queryState) => queryState.isFetchingNextPage)),
  );
  const isLoading = $derived(
    query.pipe(map((queryState) => queryState.isLoading)),
  );
  const isError = $derived(
    query.pipe(map((queryState) => queryState.isError)),
  );

  const fetchNextPage = async () => {
    const queryState = await firstValueFrom(query);
    await queryState.fetchNextPage();
  };

  const retry = async () => {
    const queryState = await firstValueFrom(query);
    await queryState.refetch();
  };

  const title = $derived(
    kind === "paused"
      ? m.header_paused_items({ count })
      : m.header_skipped_items({ count }),
  );
  const description = $derived(
    kind === "paused"
      ? m.description_paused_items()
      : m.description_skipped_items(),
  );
  const emptyText = $derived(
    kind === "paused" ? m.text_no_paused_items() : m.text_no_skipped_items(),
  );
</script>

<SettingsBlock {title} {description} boldTitle>
  {#if $isError}
    <SyncLoadError onRetry={retry} />
  {:else if !$isLoading && $items.length === 0}
    <p class="secondary">{emptyText}</p>
  {:else}
    <div class="trakt-sync-items-list">
      {#each $items as item (item.key)}
        <SyncItemRow
          {item}
          service={toServiceInfo({
            serviceId: item.serviceId,
            connections: $lookup,
          })}
        />
      {/each}
    </div>

    {#if $hasNextPage}
      <Button
        size="small"
        variant="secondary"
        color="default"
        disabled={$isFetchingNextPage}
        label={m.button_text_load_more()}
        onclick={fetchNextPage}
      >
        {m.button_text_load_more()}
      </Button>
    {/if}
  {/if}
</SettingsBlock>

<style lang="scss">
  .trakt-sync-items-list {
    display: flex;
    flex-direction: column;
    gap: var(--gap-s);
  }
</style>
