<script lang="ts">
  import SectionList from "$lib/components/lists/section-list/SectionList.svelte";
  import SkeletonList from "$lib/components/lists/SkeletonList.svelte";
  import { useDiscover } from "$lib/features/discover/useDiscover.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import {
    dashboardDrawerNavigation,
    DashboardDrawers,
  } from "../dashboard/_internal/dashboardDrawerNavigation";
  import ViewAllButton from "../lists/components/ViewAllButton.svelte";
  import PulseCell from "./_internal/PulseCell.svelte";
  import type { PulseItem } from "./_internal/models/PulseItem.ts";
  import PulseGraph from "./_internal/PulseGraph.svelte";
  import { useWeeklyPulse } from "./_internal/useWeeklyPulse";
  import { getDateRangeLabel } from "./_internal/utils/getDateRangeLabel";

  const { buildDrawerLink } = dashboardDrawerNavigation();
  const weeklyPulseDrawerLink = $derived(
    buildDrawerLink(DashboardDrawers.WeeklyPulse),
  );

  const { mode } = useDiscover();

  const { items, isLoading, dateRange } = useWeeklyPulse({ mode });

  const hasItems = $derived($items.length > 0);

  function getSectionPriority(entry: PulseItem): number {
    if (entry.type === "graph" && entry.kind === "screenTimeDaily") return 0;
    if (entry.type === "stat" && entry.key === "screenTimeTotal") return 1;
    if (entry.type === "graph" && entry.kind === "watchClock") return 2;
    if (entry.type === "stat" && entry.key === "avgPerDay") return 3;
    if (entry.type === "stat" && entry.key === "longestBinge") return 4;
    if (entry.type === "stat" && entry.key === "screenTimeShare") return 5;
    if (entry.type === "stat" && entry.key === "activeDays") return 6;

    return 100;
  }

  const orderedItems = $derived.by(() =>
    $items
      .map((entry, index) => ({
        entry,
        index,
        priority: getSectionPriority(entry),
      }))
      .sort((a, b) => a.priority - b.priority || a.index - b.index)
      .map((x) => x.entry),
  );
</script>

{#if hasItems || $isLoading}
  <SectionList
    id="weekly-pulse"
    items={orderedItems}
    title={m.header_stats_this_week()}
    drilldownLink={weeklyPulseDrawerLink.href}
    noscroll={weeklyPulseDrawerLink.noscroll}
    replacestate={weeklyPulseDrawerLink.replacestate}
    --height-list="var(--height-pulse-list)"
  >
    {#snippet metaInfo()}
      <p class="trakt-weekly-pulse-range tag secondary">
        {getDateRangeLabel(dateRange)}
      </p>
    {/snippet}

    {#snippet item(entry)}
      {#if entry.type === "stat"}
        <PulseCell
          key={entry.key}
          value={entry.value}
          label={entry.label}
          tooltip={entry.tooltip}
          delta={entry.delta}
          note={entry.note}
        />
      {:else if entry.type === "graph"}
        <PulseGraph kind={entry.kind} data={entry.data} />
      {/if}
    {/snippet}

    {#snippet empty()}
      {#if $isLoading}
        <div class="trakt-pulse-skeleton-wrapper">
          <SkeletonList id="weekly-pulse" variant="portrait" />
        </div>
      {/if}
    {/snippet}

    {#snippet actions()}
      <ViewAllButton
        {...weeklyPulseDrawerLink}
        label={m.button_text_view_all()}
        disabled={$items.length === 0}
        source={{ id: "weekly-pulse" }}
      />
    {/snippet}
  </SectionList>
{/if}

<style lang="scss">
  .trakt-pulse-skeleton-wrapper {
    --width-portrait-card: var(--min-pulse-card-width);
    --height-portrait-card: var(--height-pulse-card);
    --height-portrait-card-cover: var(--height-pulse-card);
    --height-card-footer: 0px;

    :global(.trakt-skeleton-card-footer) {
      display: none;
    }
  }
</style>
