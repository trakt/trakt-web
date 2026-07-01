<script lang="ts">
  import { onDestroy } from "svelte";
  import DistributionBar from "$lib/components/charts/DistributionBar.svelte";
  import { getLocale, languageTag } from "$lib/features/i18n/index.ts";
  import { toHumanDuration } from "$lib/utils/formatting/date/toHumanDuration.ts";
  import { ratio } from "$lib/utils/number/ratio.ts";
  import { time } from "$lib/utils/timing/time.ts";
  import type { ScreenTimeDailyData } from "./models/ScreenTimeDailyData";

  // Grace period before the label glides back to the peak, so crossing the gap
  // between two bars with a slow mouse doesn't snap it back mid-move.
  const RETURN_GRACE = time.seconds(0.16);

  const { data }: { data: ScreenTimeDailyData } = $props();

  const locale = $derived(getLocale());
  const lang = $derived(languageTag());

  const maxPct = $derived(Math.max(...data.percentages, 1));

  const zeroMinutes = $derived(
    new Intl.NumberFormat(locale, {
      style: "unit",
      unit: "minute",
      unitDisplay: "narrow",
    }).format(0),
  );

  // Index of the day with the most screen time; label defaults to it. -1's
  // guard is `hasPeak`: nothing watched -> no default label.
  const peakIndex = $derived(
    data.minutesPerDay.reduce(
      (best, minutes, i, all) => (minutes > (all[best] ?? -1) ? i : best),
      0,
    ),
  );
  const hasPeak = $derived((data.minutesPerDay[peakIndex] ?? 0) > 0);

  // Only one value is ever labelled at a time: the peak by default, or the day
  // the user hovers / focuses / taps. A single label glides between columns
  // (see `.screen-time-value`) so it never overlaps in long locales.
  let activeIndex = $state<number | null>(null);
  const shownIndex = $derived(activeIndex ?? (hasPeak ? peakIndex : null));

  // Cache the formatted durations so hover/focus re-renders don't rebuild an
  // Intl.NumberFormat per column on every tick.
  const durations = $derived(
    data.minutesPerDay.map(
      (minutes) => toHumanDuration({ minutes }, lang) || zeroMinutes,
    ),
  );
  const shownDuration = $derived(
    shownIndex == null ? "" : durations[shownIndex] ?? zeroMinutes,
  );

  // Continuous brand-purple ramp: taller day -> deeper purple. The mix is
  // resolved in CSS from each bar's `--daily-bar-strength` (0-1), so JS only
  // forwards the numeric fraction. `clamp` keeps the color-mix percentage valid
  // even if a stray value lands outside [0, 1].
  const DAILY_BAR_COLOR =
    "color-mix(in oklab, var(--viz-3), var(--viz-5) clamp(0%, calc(var(--daily-bar-strength) * 100%), 100%))";

  let returnTimer: ReturnType<typeof setTimeout> | undefined;

  const reveal = (index: number) => {
    clearTimeout(returnTimer);
    activeIndex = index;
  };
  // Defer the return so a fresh enter/focus during the grace window cancels it;
  // only a genuine exit lets the label glide back to the peak.
  const scheduleReturn = () => {
    clearTimeout(returnTimer);
    returnTimer = setTimeout(() => (activeIndex = null), RETURN_GRACE);
  };

  onDestroy(() => clearTimeout(returnTimer));
</script>

<div
  class="trakt-pulse-graph-screen-time-daily"
  class:has-value={shownIndex != null}
  style="--column-count: {data.labels.length}; --active-column: {shownIndex ??
    0};"
>
  <div class="value-track" aria-hidden="true">
    <span class="screen-time-value tag bold no-wrap">{shownDuration}</span>
  </div>

  {#each data.labels as label, i (i)}
    {@const pct = data.percentages[i] ?? 0}
    {@const fraction = ratio({ value: pct, total: maxPct })}
    {@const duration = durations[i] ?? zeroMinutes}
    <button
      type="button"
      class="screen-time-column"
      aria-label="{label}: {duration}"
      onpointerenter={(e) => e.pointerType !== "touch" && reveal(i)}
      onpointerleave={(e) => e.pointerType !== "touch" && scheduleReturn()}
      onclick={() => reveal(i)}
      onfocus={() => reveal(i)}
      onblur={scheduleReturn}
    >
      <div
        class="screen-time-bar-container"
        class:is-active={i === activeIndex}
        aria-hidden="true"
      >
        <DistributionBar
          orientation="vertical"
          {fraction}
          color={DAILY_BAR_COLOR}
          index={i}
          active={i === activeIndex}
          minVisible={0.03}
          label="{label}: {duration}"
          --distribution-bar-thickness="100%"
          --daily-bar-strength={fraction}
        />
      </div>
      <span class="screen-time-label tag ellipsis no-wrap">{label}</span>
    </button>
  {/each}
</div>

<style lang="scss">
  .trakt-pulse-graph-screen-time-daily {
    position: relative;
    display: grid;
    grid-template-columns: repeat(var(--column-count), 1fr);
    gap: var(--ni-8);

    // Reserve one line above the bars for the sliding value label.
    padding-block-start: calc(1lh + var(--ni-4));

    flex: 1;
  }

  // Overlay spanning the bars, so the single value label can sit over any
  // column. `pointer-events: none` keeps hovers hitting the bars underneath.
  .value-track {
    position: absolute;
    inset-inline: 0;
    inset-block-start: 0;
    pointer-events: none;
  }

  // One label, parked over the active column. Sliding (rather than teleporting)
  // between columns removes the jump when hovering across the chart on desktop.
  // Width is one column (same formula the bar grid uses), so `translateX` of
  // `activeColumn` column-widths-plus-gaps lands it dead-centre on that column.
  .screen-time-value {
    display: block;
    width: calc(
      (100% - (var(--column-count) - 1) * var(--ni-8)) / var(--column-count)
    );
    text-align: center;
    opacity: 0;
    transform: translateX(
      calc(var(--rtl-sign, 1) * var(--active-column, 0) * (100% + var(--ni-8)))
    );
    transition:
      transform var(--transition-duration-short) var(--viz-enter-ease, ease),
      opacity var(--transition-duration-short) ease;
  }

  .has-value .screen-time-value {
    opacity: 1;
  }

  .screen-time-column {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    gap: var(--ni-4);

    min-width: 0;

    // Reset native button chrome; the column stays a plain interactive stack.
    appearance: none;
    border: none;
    background: none;
    padding: 0;
    margin: 0;
    color: inherit;
    font: inherit;
    cursor: pointer;
    // Let vertical page scroll pass through; drop the native tap highlight.
    touch-action: pan-y;
    -webkit-tap-highlight-color: transparent;
    // The bar ring below is the focus indicator; suppress the native outline so
    // it doesn't double up with a mismatched box around the whole column.
    outline: none;
  }

  // The container is the bar's footprint, so the ring hugs the bar rather than
  // boxing the whole column. Rings on hover / tap (is-active) and keyboard focus.
  .screen-time-bar-container {
    width: 64%;
    height: var(--ni-80);
    box-sizing: border-box;

    border-radius: var(--viz-bar-radius);
    outline: var(--ni-2) solid transparent;
    outline-offset: var(--ni-2);
    transition: outline-color var(--transition-increment) ease;
  }

  .screen-time-bar-container.is-active,
  .screen-time-column:focus-visible .screen-time-bar-container {
    outline-color: var(--viz-1);
  }

  .screen-time-label {
    width: 100%;
    text-align: center;
  }
</style>
