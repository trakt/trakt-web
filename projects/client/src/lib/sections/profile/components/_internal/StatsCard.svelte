<script lang="ts">
  import type { StatsCardProps } from './StatsCardProps.ts';
  import WatchStats from './WatchStats.svelte';

  const { title, stats, isLoading, footer }: StatsCardProps = $props();
</script>

<div class="trakt-stats-card">
  <span class="secondary bold">{title}</span>
  <div class="trakt-stats-card-content">
    <div class="trakt-stats-card-body">
      <WatchStats {stats} {isLoading} size="large" />
    </div>
    {@render footer()}
  </div>
</div>

<style lang="scss">
  .trakt-stats-card,
  .trakt-stats-card-content {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);
  }

  .trakt-stats-card {
    position: relative;
    height: 100%;
    width: 100%;
    max-width: var(--ni-288);
  }

  .trakt-stats-card-content {
    flex-grow: 1;
    justify-content: space-between;
  }

  .trakt-stats-card-body {
    flex-grow: 1;
    display: flex;
    align-items: center;
  }
</style>
