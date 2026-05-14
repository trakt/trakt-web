<script lang="ts">
  import SectionList from "$lib/components/lists/section-list/SectionList.svelte";
  import SkeletonList from "$lib/components/lists/SkeletonList.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import {
    dashboardDrawerNavigation,
    DashboardDrawers,
  } from "../dashboard/_internal/dashboardDrawerNavigation";
  import PulseCell from "./_internal/PulseCell.svelte";
  import PulseGraph from "./_internal/PulseGraph.svelte";
  import { useWeeklyPulse } from "./_internal/useWeeklyPulse";
  import { getDateRangeLabel } from "./_internal/utils/getDateRangeLabel";
  import { pairStatRuns } from "./_internal/utils/pairStatRuns.ts";

  const { buildDrawerLink } = dashboardDrawerNavigation();
  const weeklyPulseDrawerLink = $derived(
    buildDrawerLink(DashboardDrawers.WeeklyPulse),
  );

  const { items, isLoading, dateRange } = useWeeklyPulse();

  const hasItems = $derived($items.length > 0);

  const orderedItems = $derived(pairStatRuns($items));
</script>

{#if hasItems || $isLoading}
  <SectionList
    id="weekly-pulse"
    items={orderedItems}
    title={m.header_stats_this_week()}
    drilldown={{
      ...weeklyPulseDrawerLink,
      source: { id: "weekly-pulse" },
      label: m.button_text_view_all(),
    }}
    --height-list="var(--height-pulse-list)"
  >
    {#snippet metaInfo()}
      <span class="trakt-weekly-pulse-range">
        {getDateRangeLabel(dateRange)}
      </span>
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

  :global(#weekly-pulse .trakt-list-title) {
    flex-direction: row;
    align-items: baseline;
    gap: var(--ni-12);
  }

  .trakt-weekly-pulse-range {
    font-size: var(--ni-13);
    color: var(--shade-400);
    font-weight: 500;
  }
</style>
