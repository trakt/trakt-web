<script lang="ts">
  import SectionList from "$lib/components/lists/section-list/SectionList.svelte";
  import SkeletonList from "$lib/components/lists/SkeletonList.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import { languageTag } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages.ts";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
  import PulseCell from "./_internal/PulseCell.svelte";
  import PulseGraph from "./_internal/PulseGraph.svelte";
  import { useWeeklyPulse } from "./_internal/useWeeklyPulse";

  const { user } = useUser();

  const { items, isLoading } = $derived(
    useWeeklyPulse({ slug: $user.slug }),
  );

  const weekRangeOffset = 6;
  const mobileMaxUnits = 2;
  const tabletSmMaxItems = 5;

  const isMobile = useMedia(WellKnownMediaQuery.mobile);
  const isTabletSm = useMedia(WellKnownMediaQuery.tabletSmall);

  const dateRange = $derived.by(() => {
    const now = new Date();
    const weekStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - weekRangeOffset,
    );
    return `${weekStart.toLocaleString(languageTag(), { month: "short", day: "numeric" })} – ${now.toLocaleString(languageTag(), { month: "short", day: "numeric" })}`;
  });

  const allItems = $derived($isLoading ? [] : ($items ?? []).filter((i) => i != null));

  const visibleItems = $derived.by(() => {
    if ($isMobile) {
      return allItems.reduce<{ items: typeof allItems; units: number }>(
        ({ items, units }, item) => {
          const cost = item.type === "graph" ? 2 : 1;
          return units + cost > mobileMaxUnits
            ? { items, units }
            : { items: [...items, item], units: units + cost };
        },
        { items: [], units: 0 },
      ).items;
    }
    if ($isTabletSm) return allItems.slice(0, tabletSmMaxItems);
    return allItems;
  });

  const hasItems = $derived(visibleItems.length > 0);
</script>

{#if hasItems || $isLoading}
  <SectionList
    id="weekly-pulse"
    items={visibleItems}
    title={m.header_stats_this_week()}
    layout="flex-wrap"
    --height-list="var(--height-pulse-card)"
    --item-min-width="var(--min-pulse-card-width)"
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
