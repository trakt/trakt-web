<script lang="ts">
  import CalendarIcon from "$lib/components/icons/CalendarIcon.svelte";
  import ClockIcon from "$lib/components/icons/ClockIcon.svelte";
  import DiscoverIcon from "$lib/components/icons/DiscoverIcon.svelte";
  import MovieIcon from "$lib/components/icons/MovieIcon.svelte";
  import PlayIcon from "$lib/components/icons/PlayIcon.svelte";
  import ShowIcon from "$lib/components/icons/ShowIcon.svelte";
  import TrendIcon from "$lib/components/icons/TrendIcon.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import { languageTag } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages.ts";
  import PulseCell from "./_internal/PulseCell.svelte";
  import PulseGraph from "./_internal/PulseGraph.svelte";
  import { useWeeklyPulse } from "./_internal/useWeeklyPulse";

  const { user } = useUser();

  const { stats, graphData, selectedGraph, isLoading } = $derived(
    useWeeklyPulse({ slug: $user.slug }),
  );

  const dateRange = $derived.by(() => {
    const now = new Date();
    const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6);
    return `${weekStart.toLocaleString(languageTag(), { month: "short", day: "numeric" })} – ${now.toLocaleString(languageTag(), { month: "short", day: "numeric" })}`;
  });

  // Graph takes 2 cell slots, so show 4 cells + graph. No graph = 6 cells.
  const cellCount = $derived($selectedGraph ? 4 : 6);
  const visibleStats = $derived(($stats ?? []).slice(0, cellCount));
  const shouldShow = $derived(!$isLoading && visibleStats.length > 0);
</script>

{#if shouldShow}
  <div class="trakt-weekly-pulse">
    <div class="trakt-weekly-pulse-header">
      <p class="trakt-weekly-pulse-title bold">{m.header_stats_this_week()}</p>
      <p class="trakt-weekly-pulse-range tag secondary">{dateRange}</p>
    </div>

    <div class="trakt-weekly-pulse-grid">
      {#each visibleStats as stat (stat.key)}
        <PulseCell value={stat.value} label={stat.label} delta={stat.delta} note={stat.note}>
          {#snippet icon()}
            {#if stat.key === "totalPlays"}
              <PlayIcon />
            {:else if stat.key === "episodes"}
              <ShowIcon />
            {:else if stat.key === "movies"}
              <MovieIcon />
            {:else if stat.key === "shows"}
              <DiscoverIcon />
            {:else if stat.key === "activeDays"}
              <CalendarIcon />
            {:else if stat.key === "busiestDay"}
              <TrendIcon direction="up" />
            {:else if stat.key === "longestBinge"}
              <PlayIcon />
            {:else if stat.key === "hours"}
              <ClockIcon />
            {/if}
          {/snippet}
        </PulseCell>
      {/each}

      {#if $selectedGraph && $graphData}
        <PulseGraph kind={$selectedGraph} data={$graphData} />
      {/if}
    </div>
  </div>
{/if}

<style lang="scss">
  .trakt-weekly-pulse {
    padding: var(--ni-4) var(--layout-distance-side);
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);
  }

  .trakt-weekly-pulse-header {
    display: flex;
    align-items: baseline;
    gap: var(--gap-xs);
  }

  .trakt-weekly-pulse-title {
    font-size: var(--font-size-text);
  }

  .trakt-weekly-pulse-grid {
    display: flex;
    flex-wrap: wrap;
    gap: var(--gap-xs);
  }
</style>
