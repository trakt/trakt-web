<script lang="ts">
  import SectionList from "$lib/components/lists/section-list/SectionList.svelte";
  import SkeletonList from "$lib/components/lists/SkeletonList.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import { getLocale } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages.ts";
  import { toHumanDay } from "$lib/utils/formatting/date/toHumanDay";
  import PulseCell from "./_internal/PulseCell.svelte";
  import PulseGraph from "./_internal/PulseGraph.svelte";
  import { useWeeklyPulse } from "./_internal/useWeeklyPulse";
  import { pairStatRuns } from "./_internal/utils/pairStatRuns.ts";

  const { user } = useUser();

  const { items, isLoading } = $derived(useWeeklyPulse({ slug: $user.slug }));

  const weekRangeOffset = 6;

  const dateRange = $derived.by(() => {
    const now = new Date();
    const weekStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - weekRangeOffset,
    );
    return `${toHumanDay(weekStart, getLocale(), "short")} - ${toHumanDay(now, getLocale(), "short")}`;
  });

  const hasItems = $derived($items.length > 0);

  const orderedItems = $derived(pairStatRuns($items));
</script>

{#if hasItems || $isLoading}
  <SectionList
    id="weekly-pulse"
    items={orderedItems}
    title={m.header_stats_this_week()}
    --height-list="var(--height-pulse-list)"
  >
    {#snippet metaInfo()}
      <p class="trakt-weekly-pulse-range tag secondary">{dateRange}</p>
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
</style>
