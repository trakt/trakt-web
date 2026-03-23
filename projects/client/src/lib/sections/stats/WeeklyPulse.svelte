<script lang="ts">
  import SectionList from "$lib/components/lists/section-list/SectionList.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import { languageTag } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages.ts";
  import PulseCell from "./_internal/PulseCell.svelte";
  import PulseGraph from "./_internal/PulseGraph.svelte";
  import { useWeeklyPulse } from "./_internal/useWeeklyPulse";

  const { user } = useUser();

  const { items, isLoading } = $derived(
    useWeeklyPulse({ slug: $user.slug }),
  );

  const weekRangeOffset = 6;

  const dateRange = $derived.by(() => {
    const now = new Date();
    const weekStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - weekRangeOffset,
    );
    return `${weekStart.toLocaleString(languageTag(), { month: "short", day: "numeric" })} – ${now.toLocaleString(languageTag(), { month: "short", day: "numeric" })}`;
  });

  const visibleItems = $derived(($items ?? []).filter((i) => i != null));
  const hasItems = $derived(!$isLoading && visibleItems.length > 0);
</script>

{#if hasItems || $isLoading}
  <SectionList
    id="weekly-pulse"
    items={visibleItems}
    title={m.header_stats_this_week()}
    --height-list="var(--height-pulse-list)"
    --width-override-card="var(--width-pulse-card)"
    classList="trakt-weekly-pulse-list"
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
        <div style="--width-override-card: calc(2 * var(--width-pulse-card) + var(--list-gap))">
          <PulseGraph kind={entry.kind} data={entry.data} />
        </div>
      {/if}
    {/snippet}
  </SectionList>
{/if}

<style lang="scss">
  :global(.trakt-weekly-pulse-list) {
    :global(.section-list-horizontal-scroll) {
      overflow-x: hidden;
      mask-image: linear-gradient(
        to right,
        black calc(100% - var(--layout-distance-side)),
        transparent 100%
      );
    }
  }
</style>
