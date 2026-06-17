<script lang="ts">
  import Button from '$lib/components/buttons/Button.svelte';
  import * as m from '$lib/features/i18n/messages.ts';
  import type { DataSync } from '$lib/requests/models/DataSync.ts';
  import DataSyncRow from './streaming-sync/DataSyncRow.svelte';
  import type { ServiceInfo } from './streaming-sync/toServiceInfo.ts';

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

<div class="trakt-data-sync-list">
  {#each syncs as sync (sync.key)}
    <DataSyncRow
      {sync}
      service={getService?.(sync)}
      href={getHref?.(sync)}
      onUndo={getOnUndo(sync.id)}
    />
  {/each}
</div>

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

<style lang="scss">
  .trakt-data-sync-list {
    display: flex;
    flex-direction: column;
    gap: var(--gap-s);
  }
</style>
