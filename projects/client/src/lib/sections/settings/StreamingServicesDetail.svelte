<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import { useQuery } from "$lib/features/query/useQuery.ts";
  import { dataSyncQuery } from "$lib/requests/queries/streaming-sync/dataSyncQuery.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";
  import { firstValueFrom, map } from "rxjs";
  import SettingsGroupCard from "./_internal/SettingsGroupCard.svelte";
  import SettingsSection from "./_internal/SettingsSection.svelte";
  import DataSyncRow from "./_internal/streaming-services/DataSyncRow.svelte";
  import SyncItemsSection from "./_internal/streaming-services/SyncItemsSection.svelte";
  import SyncLoadError from "./_internal/streaming-services/SyncLoadError.svelte";
  import { toServiceInfo } from "./_internal/streaming-services/toServiceInfo.ts";
  import { useStreamingServiceLookup } from "./_internal/streaming-services/useStreamingServiceLookup.ts";
  import { useStreamingServicesActions } from "./_internal/streaming-services/useStreamingServicesActions.ts";

  const { syncId }: { syncId: number } = $props();

  const actions = useStreamingServicesActions();
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

<div class="trakt-streaming-services-detail">
  <SettingsSection
    title={m.header_sync_detail({ id: syncId })}
    description={m.description_sync_detail()}
    crumb={{
      href: UrlBuilder.settings.streamingServices(),
      label: m.link_text_streaming_sync_settings(),
    }}
  >
    {#if $isError}
      <SyncLoadError onRetry={retry} />
    {:else if $sync}
      <SettingsGroupCard>
        <DataSyncRow
          sync={$sync}
          service={toServiceInfo({
            serviceId: $sync.source,
            application: $sync.application,
            connections: $lookup,
          })}
          onUndo={actions.undo($sync.id)}
        />
      </SettingsGroupCard>
    {/if}
  </SettingsSection>

  {#if $sync && $sync.pausedCount > 0}
    <SyncItemsSection {syncId} kind="paused" count={$sync.pausedCount} />
  {/if}

  {#if $sync && $sync.skippedCount > 0}
    <SyncItemsSection {syncId} kind="skipped" count={$sync.skippedCount} />
  {/if}
</div>

<style lang="scss">
  .trakt-streaming-services-detail {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xl);
  }
</style>
