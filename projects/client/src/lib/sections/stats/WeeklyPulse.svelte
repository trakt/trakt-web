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
  import SectionList from "$lib/components/lists/section-list/SectionList.svelte";
  import SkeletonList from "$lib/components/lists/SkeletonList.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import { languageTag } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages.ts";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
  import type { Component } from "svelte";
  import PulseCell from "./_internal/PulseCell.svelte";
  import PulseGraph from "./_internal/PulseGraph.svelte";
  import {
    useWeeklyPulse,
    type PulseGraphData,
    type PulseGraphType,
    type PulseStat,
  } from "./_internal/useWeeklyPulse";

  type PulseItem =
    | ({ type: "stat" } & PulseStat)
    | {
        type: "graph";
        key: string;
        kind: PulseGraphType;
        data: PulseGraphData;
      };

  const statIcons: Record<
    string,
    { component: Component; props?: Record<string, string> }
  > = {
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
  const cellsWithoutGraph = 6;

  const dateRange = $derived.by(() => {
    const now = new Date();
    const weekStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - weekRangeOffset,
    );
    return `${weekStart.toLocaleString(languageTag(), { month: "short", day: "numeric" })} – ${now.toLocaleString(languageTag(), { month: "short", day: "numeric" })}`;
  });

  const cellCount = $derived(
    $selectedGraph ? cellsWithGraph : cellsWithoutGraph,
  );
  const visibleStats = $derived(($stats ?? []).slice(0, cellCount));
  const shouldShow = $derived(!$isLoading && visibleStats.length > 0);

  const isMobile = useMedia(WellKnownMediaQuery.mobile);
  const isTabletSmall = useMedia(WellKnownMediaQuery.tabletSmall);
  const isSmallDevice = $derived($isMobile || $isTabletSmall);

  const items = $derived.by<PulseItem[]>(() => {
    if (!shouldShow) return [];

    const statItems = (
      isSmallDevice ? visibleStats.slice(0, 1) : visibleStats
    ).map((stat) => ({ type: "stat" as const, ...stat }));

    if (!$graphData || !$selectedGraph) return statItems;

    return [
      ...statItems,
      {
        type: "graph" as const,
        key: $selectedGraph,
        kind: $selectedGraph,
        data: $graphData,
      },
    ];
  });

  // Quick hack to make card widths screen fitting
  const cardWidth = $derived.by(() => {
    const statCount = visibleStats.length;
    const hasGraph = Boolean($graphData && $selectedGraph);
    const graphCount = hasGraph ? 1 : 0;
    const itemCount = statCount + graphCount;
    const gapCount = Math.max(itemCount, 0);
    const widthUnits = statCount + graphCount * 2;
    return `calc((var(--list-inner-width) - ${gapCount} * var(--list-gap)) / ${widthUnits})`;
  });

  const skeletonCount = 7;
  const skeletonCardWidth = $derived.by(() => {
    return `calc((var(--list-inner-width) - ${skeletonCount} * var(--list-gap)) / ${skeletonCount})`;
  });

  const graphCardWidth = $derived(`calc(2 * (${cardWidth}))`);
</script>

<SectionList
  id="weekly-pulse"
  {items}
  title={m.header_stats_this_week()}
  --height-list="var(--ni-164)"
  --width-override-card={cardWidth}
  classList="trakt-weekly-pulse-list"
>
  {#snippet metaInfo()}
    <p class="trakt-weekly-pulse-range tag secondary">{dateRange}</p>
  {/snippet}

  {#snippet item(entry)}
    {#if entry.type === "stat"}
      <PulseCell
        value={entry.value}
        label={entry.label}
        tooltip={entry.tooltip}
        delta={entry.delta}
        note={entry.note}
      >
        {#snippet icon()}
          {@const iconDef = statIcons[entry.key]}
          {#if iconDef}
            <svelte:component this={iconDef.component} {...iconDef.props} />
          {/if}
        {/snippet}
      </PulseCell>
    {:else if entry.type === "graph"}
      <div style="--width-override-card: {graphCardWidth}">
        <PulseGraph kind={entry.kind} data={entry.data} />
      </div>
    {/if}
  {/snippet}

  {#snippet empty()}
    {#if $isLoading}
      <!-- Skeleton example -->
      <SkeletonList
        id="weekly-pulse"
        variant="portrait"
        limit={skeletonCount}
        type="compact"
        --width-override-card={skeletonCardWidth}
        --height-override-card-cover="var(--ni-156)"
      />
    {/if}
  {/snippet}
</SectionList>

<!-- 
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

    <div
      class="trakt-weekly-pulse-grid"
      class:has-interesting-content={$graphData && $selectedGraph}
    >
      {#each visibleStats as stat (stat.key)}
        <PulseCell
          value={stat.value}
          label={stat.label}
          tooltip={stat.tooltip}
          delta={stat.delta}
          note={stat.note}
        >
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
{/if} -->

<style lang="scss">
  :global(.trakt-weekly-pulse-list) {
    :global(.section-list-horizontal-scroll) {
      overflow-x: hidden;
    }
  }

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
    gap: var(--list-gap);

    &.has-interesting-content {
      grid-template-columns: repeat(5, 1fr) 2fr;
    }
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
