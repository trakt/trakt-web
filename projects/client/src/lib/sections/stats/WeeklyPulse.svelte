<script lang="ts">
  import SectionList from "$lib/components/lists/section-list/SectionList.svelte";
  import SkeletonList from "$lib/components/lists/SkeletonList.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import * as m from "$lib/features/i18n/messages.ts";
  import {
    dashboardDrawerNavigation,
    DashboardDrawers,
  } from "../dashboard/_internal/dashboardDrawerNavigation";
  import ViewAllButton from "../lists/components/ViewAllButton.svelte";
  import { getDateRangeLabel } from "./_internal/getDateRangeLabel";
  import PulseCell from "./_internal/PulseCell.svelte";
  import PulseGraph from "./_internal/PulseGraph.svelte";
  import { useWeeklyPulse } from "./_internal/useWeeklyPulse";
  import { pairStatRuns } from "./_internal/utils/pairStatRuns.ts";

  const { buildDrawerLink } = dashboardDrawerNavigation();
  const drilldownLink = $derived(buildDrawerLink(DashboardDrawers.WeeklyPulse));

  const { user } = useUser();

  const { items, isLoading, dateRange } = $derived(
    useWeeklyPulse({ slug: $user.slug }),
  );

  const hasItems = $derived($items.length > 0);

  const orderedItems = $derived(pairStatRuns($items));
</script>

{#if hasItems || $isLoading}
  <SectionList
    id="weekly-pulse"
    items={orderedItems}
    title={m.header_stats_this_week()}
    {drilldownLink}
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
        href={drilldownLink}
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
