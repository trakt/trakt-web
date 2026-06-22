<script lang="ts">
  import Button from '$lib/components/buttons/Button.svelte';
  import * as m from '$lib/features/i18n/messages.ts';
  import type { DataSync } from '$lib/requests/models/DataSync.ts';
  import SettingsGroupCard from './SettingsGroupCard.svelte';
  import DataSyncRow from './streaming-services/DataSyncRow.svelte';
  import type { ServiceInfo } from './streaming-services/toServiceInfo.ts';

  type DataSyncListProps = {
    syncs: DataSync[];
    hasNextPage: boolean;
    isFetchingNextPage?: boolean;
    onLoadMore: () => void;
    getOnUndo: (id: number) => () => void;
    getService?: (sync: DataSync) => ServiceInfo | undefined;
    getHref?: (sync: DataSync) => string;
  };

  const {
    syncs,
    hasNextPage,
    isFetchingNextPage,
    onLoadMore,
    getOnUndo,
    getService,
    getHref,
  }: DataSyncListProps = $props();
</script>

<SettingsGroupCard>
  {#each syncs as sync (sync.key)}
    <DataSyncRow
      {sync}
      service={getService?.(sync)}
      href={getHref?.(sync)}
      onUndo={getOnUndo(sync.id)}
    />
  {/each}
</SettingsGroupCard>

{#if hasNextPage}
  <Button
    size="small"
    variant="secondary"
    color="default"
    disabled={isFetchingNextPage}
    label={m.button_text_load_more()}
    onclick={onLoadMore}
  >
    {m.button_text_load_more()}
  </Button>
{/if}
