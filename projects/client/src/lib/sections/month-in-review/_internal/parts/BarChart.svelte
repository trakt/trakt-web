<script lang="ts">
  import DistributionBar from "$lib/components/charts/DistributionBar.svelte";
  import { whenInViewport } from "$lib/utils/actions/whenInViewport";
  import { REVEAL_MARGIN } from "./REVEAL_MARGIN.ts";
  import { time } from "$lib/utils/timing/time.ts";
  import { onDestroy } from "svelte";
  import type { BarChartItem } from "./BarChartItem.ts";

  const RETURN_GRACE = time.seconds(0.16);
  const WEEKEND_COLOR = "var(--viz-5)";
  const STRENGTH_RAMP_COLOR =
    "color-mix(in oklab, var(--viz-3), var(--viz-5) clamp(0%, calc(var(--viz-bar-strength) * 100%), 100%))";

  const { items }: { items: ReadonlyArray<BarChartItem> } = $props();

  const max = $derived(Math.max(1, ...items.map((item) => item.value)));
  const peakIndex = $derived(
    items.reduce(
      (best, item, index) =>
        item.value > (items.at(best)?.value ?? -1) ? index : best,
      0,
    ),
  );
  const hasPeak = $derived((items.at(peakIndex)?.value ?? 0) > 0);

  let activeIndex = $state<number | null>(null);
  let isInView = $state(false);
  const shownIndex = $derived(activeIndex ?? (hasPeak ? peakIndex : null));
  const shown = $derived(
    shownIndex === null ? undefined : items.at(shownIndex),
  );

  let returnTimer: ReturnType<typeof setTimeout> | undefined;

  const reveal = (index: number) => {
    clearTimeout(returnTimer);
    activeIndex = index;
  };

  const scheduleReturn = () => {
    clearTimeout(returnTimer);
    returnTimer = setTimeout(() => (activeIndex = null), RETURN_GRACE);
  };

  onDestroy(() => clearTimeout(returnTimer));
</script>

<div
  class="trakt-month-review-bar-chart"
  class:has-value={shown !== undefined}
  class:is-in-view={isInView}
  use:whenInViewport={{
    callback: () => (isInView = true),
    rootMargin: REVEAL_MARGIN,
  }}
  style="--column-count: {items.length}; --active-column: {shownIndex ?? 0};"
>
  <div class="value-track" aria-hidden="true">
    <span class="value tag bold no-wrap">
      {shown ? `${shown.label} · ${shown.valueLabel}` : ""}
    </span>
  </div>

  {#each items as item, index (index)}
    {@const fraction = item.value / max}
    <button
      type="button"
      class="column"
      aria-label="{item.label}: {item.valueLabel}"
      onpointerenter={(event) => event.pointerType !== "touch" && reveal(index)}
      onpointerleave={(event) =>
        event.pointerType !== "touch" && scheduleReturn()}
      onclick={() => reveal(index)}
      onfocus={() => reveal(index)}
      onblur={scheduleReturn}
    >
      <span
        class="bar"
        class:is-active={index === activeIndex}
        style="--index: {index}"
        aria-hidden="true"
      >
        <DistributionBar
          orientation="vertical"
          {fraction}
          color={item.tone === "weekend" ? WEEKEND_COLOR : STRENGTH_RAMP_COLOR}
          {index}
          active={index === shownIndex}
          minVisible={0.03}
          label="{item.label}: {item.valueLabel}"
          --distribution-bar-thickness="100%"
          --viz-bar-strength={fraction}
        />
      </span>
      <span class="axis tag no-wrap">{item.axisLabel ?? ""}</span>
    </button>
  {/each}
</div>

<style>
  .trakt-month-review-bar-chart {
    --column-gap: var(--ni-4);

    position: relative;
    display: grid;
    grid-template-columns: repeat(var(--column-count), minmax(0, 1fr));
    flex: 1;
    gap: var(--column-gap);
    padding-block-start: calc(1lh + var(--ni-8));
  }

  .value-track {
    position: absolute;
    inset-inline: 0;
    inset-block-start: 0;
    pointer-events: none;
  }

  .value {
    display: block;
    width: max-content;
    opacity: 0;
    transform: translateX(
      calc(
        var(--rtl-sign) *
          clamp(
            0px,
            calc(
              var(--active-column) *
                (
                  (100cqw - (var(--column-count) - 1) * var(--column-gap)) /
                    var(--column-count) + var(--column-gap)
                )
            ),
            100cqw - 100%
          )
      )
    );
    transition:
      transform var(--transition-duration-short) var(--viz-enter-ease, ease),
      opacity var(--transition-duration-short) ease;
  }

  .has-value .value {
    opacity: 1;
  }

  .trakt-month-review-bar-chart,
  .value-track {
    container-type: inline-size;
  }

  .column {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    gap: var(--ni-4);
    min-width: 0;
    appearance: none;
    border: none;
    background: none;
    padding: 0;
    margin: 0;
    color: inherit;
    font: inherit;
    cursor: pointer;
    touch-action: pan-y;
    -webkit-tap-highlight-color: transparent;
    outline: none;
  }

  .bar {
    display: block;
    flex: 1;
    width: 72%;
    min-height: var(--ni-144);
    border-radius: var(--viz-bar-radius);
    outline: var(--ni-2) solid transparent;
    outline-offset: var(--ni-2);
    transform-origin: bottom;
    scale: 1 0;
    transition:
      outline-color var(--transition-increment) ease,
      scale 700ms cubic-bezier(0.16, 1, 0.3, 1) calc(var(--index) * 18ms);
  }

  .is-in-view .bar {
    scale: 1 1;
  }

  .bar.is-active,
  .column:focus-visible .bar {
    outline-color: var(--viz-1);
  }

  .axis {
    min-height: 1lh;
    color: var(--color-text-secondary);
  }

  @media (prefers-reduced-motion: reduce) {
    .value,
    .bar {
      transition: none;
    }

    .bar {
      scale: 1 1;
    }
  }
</style>
