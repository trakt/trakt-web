<script lang="ts">
  import DistributionBar from "$lib/components/charts/DistributionBar.svelte";
  import { getLocale, languageTag } from "$lib/features/i18n/index.ts";
  import { toHumanDuration } from "$lib/utils/formatting/date/toHumanDuration.ts";
  import { ratio } from "$lib/utils/number/ratio.ts";
  import type { ScreenTimeDailyData } from "./models/ScreenTimeDailyData";

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
  // the user hovers / focuses / taps. A single slot keeps long locales (e.g.
  // pt "8 h 28 min") from overlapping across the narrow columns.
  let activeIndex = $state<number | null>(null);
  const shownIndex = $derived(activeIndex ?? (hasPeak ? peakIndex : null));

  // Cache the formatted durations so hover/focus re-renders don't rebuild an
  // Intl.NumberFormat per column on every tick.
  const durations = $derived(
    data.minutesPerDay.map(
      (minutes) => toHumanDuration({ minutes }, lang) || zeroMinutes,
    ),
  );

  // Sequential brand-purple intensity ramp (light -> deep = more screen time),
  // premium and on-brand rather than a traffic-light rainbow.
  function barColor(pct: number): string {
    if (pct >= 30) return "var(--viz-5)";
    if (pct >= 15) return "var(--viz-1)";
    return "var(--viz-3)";
  }

  const reveal = (index: number) => (activeIndex = index);
  // Guard by index so a trailing leave/blur from the previous column can't wipe
  // the state a fresh enter/focus just set.
  const clear = (index: number) => {
    if (activeIndex === index) {
      activeIndex = null;
    }
  };
</script>

<div class="trakt-pulse-graph-screen-time-daily">
  {#each data.labels as label, i (i)}
    {@const pct = data.percentages[i] ?? 0}
    {@const fraction = ratio({ value: pct, total: maxPct })}
    {@const duration = durations[i] ?? zeroMinutes}
    <button
      type="button"
      class="screen-time-column"
      aria-label="{label}: {duration}"
      onpointerenter={(e) => e.pointerType !== "touch" && reveal(i)}
      onpointerleave={(e) => e.pointerType !== "touch" && clear(i)}
      onclick={() => reveal(i)}
      onfocus={() => reveal(i)}
      onblur={() => clear(i)}
    >
      <span class="screen-time-value tag bold no-wrap">
        {#if i === shownIndex}{duration}{/if}
      </span>
      <div class="screen-time-bar-container" aria-hidden="true">
        <DistributionBar
          orientation="vertical"
          {fraction}
          color={barColor(pct)}
          index={i}
          active={i === shownIndex}
          minVisible={0.03}
          label="{label}: {duration}"
          --distribution-bar-thickness="64%"
        />
      </div>
      <span class="screen-time-label tag ellipsis no-wrap">{label}</span>
    </button>
  {/each}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-pulse-graph-screen-time-daily {
    display: flex;
    gap: var(--ni-8);

    flex: 1;
  }

  .screen-time-column {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    gap: var(--ni-4);

    flex: 1;
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

    &:focus-visible {
      @include viz-focus-ring;
    }
  }

  .screen-time-bar-container {
    width: 100%;
    height: var(--ni-80);
    box-sizing: border-box;

    // Center the single vertical bar within the column slot.
    display: flex;
    justify-content: center;
  }

  .screen-time-label {
    width: 100%;
    text-align: center;
  }

  // Single value slot above the bars: reserves one line so bars stay aligned
  // whether or not a value is shown, and only one column fills it at a time.
  .screen-time-value {
    width: 100%;
    min-height: 1lh;
    text-align: center;
  }
</style>
