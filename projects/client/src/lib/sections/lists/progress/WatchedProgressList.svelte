<script lang="ts">
  import LoadingIndicator from "$lib/components/icons/LoadingIndicator.svelte";
  import { useWatchedProgressList } from "$lib/sections/lists/progress/useWatchedProgressList.ts";
  import WatchedProgressRow from "./_internal/WatchedProgressRow.svelte";

  const { list, isLoading } = useWatchedProgressList({ limit: 10 });
</script>

<div class="watched-progress-page">
  <div class="progress-list">
    {#each $list as entry (entry.key)}
      <WatchedProgressRow {entry} />
    {/each}
  </div>

  {#if $isLoading}
    <LoadingIndicator />
  {/if}
</div>

<style lang="scss">
  .watched-progress-page {
    padding: 0 var(--layout-distance-side);
  }

  .progress-list {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xl);
  }
</style>
