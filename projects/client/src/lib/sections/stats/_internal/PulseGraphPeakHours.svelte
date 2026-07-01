<script lang="ts">
  import DistributionBar from "$lib/components/charts/DistributionBar.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { ratio } from "$lib/utils/number/ratio.ts";
  import { STRENGTH_RAMP_COLOR } from "./strengthRampColor.ts";
  import type { PeakHoursData } from "./models/PeakHoursData";

  const { data }: { data: PeakHoursData } = $props();

  const max = $derived(Math.max(...data.buckets.map((b) => b.count), 1));

  // Row whose movies/episodes breakdown is revealed (hover / focus / tap).
  let activeIndex = $state<number | null>(null);

  // Cache the breakdown strings so hover/focus re-renders don't rebuild the
  // per-row messages on every tick.
  const breakdowns = $derived(
    data.buckets.map((bucket) =>
      `${m.text_stats_movies_count({ count: bucket.movies })} · ${
        m.text_stats_episodes_count({ count: bucket.episodes })
      }`
    ),
  );

  const reveal = (index: number) => (activeIndex = index);
  // Guard by index so a trailing leave/blur from the previous row can't wipe the
  // state a fresh enter/focus just set.
  const clear = (index: number) => {
    if (activeIndex === index) {
      activeIndex = null;
    }
  };
</script>

<div class="trakt-pulse-graph-peak-hours">
  {#each data.buckets as bucket, i (bucket.key)}
    {@const fraction = ratio({ value: bucket.count, total: max })}
    {@const breakdown = breakdowns.at(i) ?? ""}
    <button
      type="button"
      class="peak-row"
      class:is-active={i === activeIndex}
      aria-label="{bucket.label}: {bucket.count} ({breakdown})"
      onpointerenter={(e) => e.pointerType !== "touch" && reveal(i)}
      onpointerleave={(e) => e.pointerType !== "touch" && clear(i)}
      onclick={() => reveal(i)}
      onfocus={() => reveal(i)}
      onblur={() => clear(i)}
    >
      <span class="peak-tooltip tag">{breakdown}</span>
      <span class="peak-label tag">{bucket.label}</span>
      <div class="peak-bar" aria-hidden="true">
        <DistributionBar
          {fraction}
          color={STRENGTH_RAMP_COLOR}
          index={i}
          active={i === activeIndex}
          label="{bucket.label}: {bucket.count}"
          --viz-bar-strength={fraction}
        />
      </div>
      <span class="peak-count secondary tag">{bucket.count}</span>
    </button>
  {/each}
</div>

<style lang="scss">
  .trakt-pulse-graph-peak-hours {
    display: flex;
    flex-direction: column;
    gap: var(--ni-8);
    flex: 1;
    justify-content: space-around;
  }

  .peak-row {
    position: relative;
    display: flex;
    align-items: center;
    gap: var(--ni-8);

    // Reset native button chrome; the row stays a plain interactive stack.
    appearance: none;
    border: none;
    background: none;
    padding: var(--ni-2) 0;
    margin: 0;
    color: inherit;
    font: inherit;
    cursor: pointer;
    text-align: start;
    -webkit-tap-highlight-color: transparent;
    // The bar ring below is the focus indicator; suppress the native outline.
    outline: none;
  }

  .peak-label {
    width: var(--ni-64);
    flex-shrink: 0;
    text-align: start;
  }

  // The bar wrapper is the bar's footprint, so the ring hugs the bar rather than
  // boxing the whole row. Rings on hover / tap (is-active) and keyboard focus.
  .peak-bar {
    flex: 1;
    border-radius: var(--viz-bar-radius);
    outline: var(--ni-2) solid transparent;
    outline-offset: var(--ni-4);
    transition: outline-color var(--transition-increment) ease;
  }

  .peak-row.is-active .peak-bar,
  .peak-row:focus-visible .peak-bar {
    outline-color: var(--viz-1);
  }

  .peak-count {
    width: var(--ni-28);
    text-align: end;
    flex-shrink: 0;
  }

  // Breakdown popover above the bar; fades in on interaction.
  .peak-tooltip {
    position: absolute;
    inset-block-end: calc(100% - var(--ni-6));
    inset-inline-start: calc(var(--ni-64) + var(--ni-8));
    z-index: var(--layer-top);

    white-space: nowrap;
    background-color: var(--color-tooltip-background);
    color: var(--color-tooltip-text);
    font-weight: 500;
    border-radius: var(--border-radius-xs);
    padding: var(--ni-6) var(--ni-8);
    box-shadow: var(--shadow-menu);

    opacity: 0;
    transition: opacity var(--transition-increment) ease;
    pointer-events: none;
  }

  .peak-row.is-active .peak-tooltip {
    opacity: 1;
  }
</style>
