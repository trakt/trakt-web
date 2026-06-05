<script lang="ts">
  import Link from "$lib/components/link/Link.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { useQuery } from "$lib/features/query/useQuery.ts";
  import { dataSyncQuery } from "$lib/requests/queries/streaming-sync/dataSyncQuery.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";
  import { firstValueFrom, map } from "rxjs";
  import SettingsBlock from "./_internal/SettingsBlock.svelte";
  import DataSyncRow from "./_internal/streaming-sync/DataSyncRow.svelte";
  import SyncItemsSection from "./_internal/streaming-sync/SyncItemsSection.svelte";
  import SyncLoadError from "./_internal/streaming-sync/SyncLoadError.svelte";
  import { toServiceInfo } from "./_internal/streaming-sync/toServiceInfo.ts";
  import { useStreamingServiceLookup } from "./_internal/streaming-sync/useStreamingServiceLookup.ts";
  import { useStreamingSyncActions } from "./_internal/streaming-sync/useStreamingSyncActions.ts";

  const { syncId }: { syncId: number } = $props();

  const actions = useStreamingSyncActions();
  const { lookup } = useStreamingServiceLookup();

  const syncQuery = $derived(useQuery(dataSyncQuery({ id: syncId })));

  const sync = $derived(syncQuery.pipe(map((queryState) => queryState.data)));
  const isError = $derived(
    syncQuery.pipe(map((queryState) => queryState.isError)),
  );

  const retry = async () => {
    const queryState = await firstValueFrom(syncQuery);
    await queryState.refetch();
  };
</script>

<div class="trakt-streaming-sync-detail">
  <SettingsBlock
    title={m.header_sync_detail({ id: syncId })}
    description={m.description_sync_detail()}
    boldTitle
  >
    {#snippet titlePrefix()}
      <span class="title-prefix">
        <Link href={UrlBuilder.settings.streamingSync()} color="inherit">
          {m.link_text_streaming_sync_settings()}
        </Link>
        <span class="title-sep">/</span>
      </span>
    {/snippet}

    {#if $isError}
      <SyncLoadError onRetry={retry} />
    {:else if $sync}
      <DataSyncRow
        sync={$sync}
        service={toServiceInfo({
          serviceId: $sync.source,
          application: $sync.application,
          connections: $lookup,
        })}
        onUndo={actions.undo($sync.id)}
      />
    {/if}
  </SettingsBlock>

  {#if $sync && $sync.pausedCount > 0}
    <SyncItemsSection {syncId} kind="paused" count={$sync.pausedCount} />
  {/if}

  {#if $sync && $sync.skippedCount > 0}
    <SyncItemsSection {syncId} kind="skipped" count={$sync.skippedCount} />
  {/if}
</div>

<style lang="scss">
  .trakt-streaming-sync-detail {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xl);
  }

  .title-prefix {
    display: contents;

    color: var(--color-text-secondary);

    :global(.trakt-link) {
      color: var(--color-text-secondary);
      text-decoration: none;

      transition: color var(--transition-increment) ease-in-out;
    }

    :global(.trakt-link:hover) {
      color: var(--color-link-active);
    }
  }
</style>
