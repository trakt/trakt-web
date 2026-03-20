<script lang="ts">
  import CalendarIcon from "$lib/components/icons/CalendarIcon.svelte";
  import ClockIcon from "$lib/components/icons/ClockIcon.svelte";
  import CommentIcon from "$lib/components/icons/CommentIcon.svelte";
  import DiscoverIcon from "$lib/components/icons/DiscoverIcon.svelte";
  import MovieIcon from "$lib/components/icons/MovieIcon.svelte";
  import PlayIcon from "$lib/components/icons/PlayIcon.svelte";
  import ShowIcon from "$lib/components/icons/ShowIcon.svelte";
  import StarIcon from "$lib/components/icons/StarIcon.svelte";
  import TrendIcon from "$lib/components/icons/TrendIcon.svelte";
  import type { Component } from "svelte";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import { languageTag } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages.ts";
  import PulseCell from "./_internal/PulseCell.svelte";
  import PulseGraph from "./_internal/PulseGraph.svelte";
  import { useWeeklyPulse } from "./_internal/useWeeklyPulse";

  const statIcons: Record<string, { component: Component; props?: Record<string, string> }> = {
    totalPlays: { component: PlayIcon },
    episodes: { component: ShowIcon },
    movies: { component: MovieIcon },
    shows: { component: DiscoverIcon },
    activeDays: { component: CalendarIcon },
    busiestDay: { component: TrendIcon, props: { direction: "up" } },
    longestBinge: { component: PlayIcon },
    hours: { component: ClockIcon },
    ratings: { component: StarIcon, props: { fill: "full" } },
    comments: { component: CommentIcon, props: { style: "filled" } },
  };

  const { user } = useUser();

  const { stats, graphData, selectedGraph, isLoading } = $derived(
    useWeeklyPulse({ slug: $user.slug }),
  );

  const weekRangeOffset = 6;
  const cellsWithGraph = 5;
  const cellsWithoutGraph = 7;

  const dateRange = $derived.by(() => {
    const now = new Date();
    const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - weekRangeOffset);
    return `${weekStart.toLocaleString(languageTag(), { month: "short", day: "numeric" })} – ${now.toLocaleString(languageTag(), { month: "short", day: "numeric" })}`;
  });

  const cellCount = $derived($selectedGraph ? cellsWithGraph : cellsWithoutGraph);
  const visibleStats = $derived(($stats ?? []).slice(0, cellCount));
  const shouldShow = $derived(!$isLoading && visibleStats.length > 0);
</script>

{#if $isLoading}
  <div class="trakt-weekly-pulse">
    <div class="trakt-weekly-pulse-header">
      <div class="trakt-pulse-skeleton-title"></div>
    </div>
    <div class="trakt-weekly-pulse-grid">
      {#each { length: cellsWithoutGraph } as _, i (i)}
        <div class="trakt-pulse-skeleton-cell" style="--index: {i}"></div>
      {/each}
    </div>
  </div>
{:else if shouldShow}
  <div class="trakt-weekly-pulse">
    <div class="trakt-weekly-pulse-header">
      <p class="trakt-weekly-pulse-title bold">{m.header_stats_this_week()}</p>
      <p class="trakt-weekly-pulse-range tag secondary">{dateRange}</p>
    </div>

    <div class="trakt-weekly-pulse-grid">
      {#each visibleStats as stat (stat.key)}
        <PulseCell value={stat.value} label={stat.label} tooltip={stat.tooltip} delta={stat.delta} note={stat.note}>
          {#snippet icon()}
            {@const iconDef = statIcons[stat.key]}
            {#if iconDef}
              <svelte:component this={iconDef.component} {...iconDef.props} />
            {/if}
          {/snippet}
        </PulseCell>
      {/each}

      {#if $graphData && $selectedGraph}
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
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: var(--gap-xs);
  }

  /* ── Skeleton ────────────────────────────────────── */
  .trakt-pulse-skeleton-title {
    width: var(--ni-96);
    height: var(--ni-20);
    background: var(--shade-930);
    border-radius: var(--border-radius-s);
  }

  .trakt-pulse-skeleton-cell {
    background: var(--shade-930);
    border: 1px solid var(--shade-910);
    border-radius: var(--border-radius-m);
    min-height: var(--ni-148);
    position: relative;
    overflow: hidden;

    &::after {
      content: "";
      position: absolute;
      top: 0;
      width: 300%;
      height: 100%;
      transform: translateX(100%);
      animation: skeleton-shimmer 2s infinite;
      animation-delay: calc(0.1s * var(--index));
      background: linear-gradient(
        110deg,
        var(--shade-930) 0%,
        var(--shade-930) 30%,
        color-mix(in srgb, var(--color-foreground) 50%, transparent) 50%,
        var(--shade-930) 70%,
        var(--shade-930) 100%
      );
      opacity: 0.15;
    }
  }

  @keyframes skeleton-shimmer {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }
</style>
