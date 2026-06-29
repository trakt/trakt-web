<script lang="ts">
  import SectionList from "$lib/components/lists/section-list/SectionList.svelte";
  import SkeletonList from "$lib/components/lists/SkeletonList.svelte";
  import { useDiscover } from "$lib/features/filters/useDiscover.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import { profileDrawerNavigation } from "../profile/_internal/profileDrawerNavigation.ts";
  import PulseCell from "./_internal/PulseCell.svelte";
  import PulseGraph from "./_internal/PulseGraph.svelte";
  import { useWeeklyPulse } from "./_internal/useWeeklyPulse.ts";
  import { getDateRangeLabel } from "./_internal/utils/getDateRangeLabel.ts";

  const { buildScreenTimeDrawerLink } = profileDrawerNavigation();

  const { mode } = useDiscover();

  const { items, isLoading, dateRange } = $derived(
    useWeeklyPulse({ mode: $mode }),
  );

  const hasItems = $derived($items.length > 0);
</script>

{#if hasItems || $isLoading}
  <SectionList
    id={{
      scope: "screen-time",
    }}
    items={$items}
    title={m.header_screen_time()}
    drilldown={{
      ...buildScreenTimeDrawerLink(),
      source: { id: "screen-time" },
      label: m.button_text_view_all(),
    }}
    --height-list="var(--height-pulse-list)"
  >
    {#snippet metaInfo()}
      <p class="tag secondary">
        {getDateRangeLabel(dateRange)}
      </p>
    {/snippet}

    {#snippet item(entry)}
      {#if entry.type === "stat"}
        <PulseCell
          value={entry.value}
          label={entry.label}
          tooltip={entry.tooltip}
          delta={entry.delta}
          deltaKind={entry.deltaKind}
        />
      {:else if entry.type === "graph"}
        <PulseGraph item={entry} />
      {/if}
    {/snippet}

    {#snippet empty()}
      {#if $isLoading}
        <div class="trakt-pulse-skeleton-wrapper">
          <SkeletonList id="screen-time" variant="portrait" />
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
</style>
