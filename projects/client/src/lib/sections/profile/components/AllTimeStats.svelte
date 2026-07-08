<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import { useAllTimeStats } from "../stores/useAllTimeStats.ts";
  import AllTimeStatsDrawerLink from "./_internal/AllTimeStatsDrawerLink.svelte";
  import StatsCard from "./_internal/StatsCard.svelte";

  const { stats, isLoading } = useAllTimeStats();
</script>

<StatsCard title={m.text_all_time()} stats={$stats} isLoading={$isLoading}>
  {#snippet footer()}
    <div class="all-time-footer">
      <AllTimeStatsDrawerLink />
    </div>
  {/snippet}
</StatsCard>

<style lang="scss">
  .all-time-footer {
    display: flex;

    :global(.trakt-all-time-stats-drawer-link),
    :global(.trakt-button-link) {
      width: 100%;
    }
  }
</style>
