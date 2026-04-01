<script lang="ts">
  import type { YirStatsCategory } from "$lib/requests/models/YirDetail";
  import ArrowRightIcon from "$lib/components/icons/ArrowRightIcon.svelte";
  import YirWeeklyPlaysChart from "./YirWeeklyPlaysChart.svelte";
  import YirMonthlyPlaysChart from "./YirMonthlyPlaysChart.svelte";
  import YirDailyPlaysChart from "./YirDailyPlaysChart.svelte";
  import YirHourlyPlaysChart from "./YirHourlyPlaysChart.svelte";
  import { m } from "$lib/paraglide/messages";
  import { formatNumber } from "$lib/utils/format/formatNumber";

  const {
    type,
    stats,
    year,
  }: {
    type: "shows" | "movies";
    stats: YirStatsCategory;
    year: number;
  } = $props();

  const sectionTitle = $derived(type === "shows" ? m.yir_section_title_tv_shows() : m.yir_section_title_movies());
  const specificType = $derived(type === "shows" ? "episode" : "movie");

  function formatDecimal(value: number): string {
    return value.toFixed(1);
  }

  const hoursTotal = $derived(Math.round(stats.minutes.total / 60));
  const hoursMonthly = $derived(stats.minutes.monthly / 60);
  const hoursWeekly = $derived(stats.minutes.weekly / 60);
  const hoursDaily = $derived(stats.minutes.daily / 60);
</script>

<section class="yir-stats-section" id="section-{type}-stats">
  <div class="yir-page-inner">
    <div class="yir-section-header">
      <h2>
        <span class="yir-header-text">
          <strong>{formatNumber(stats.itemsCount ?? 0)}</strong> {sectionTitle}
        </span>
      </h2>
    </div>

    <div class="yir-watched-stats">
      <div class="yir-stat">
        <span class="yir-stat-number">{formatNumber(hoursTotal)}</span>
        <span class="yir-stat-unit">{m.yir_label_hours_watched()}</span>
      </div>
      <div class="yir-stat">
        <span class="yir-stat-number">{formatDecimal(hoursMonthly)}</span>
        <span class="yir-stat-unit">{m.yir_label_per_month()}</span>
      </div>
      <span class="yir-stat-arrow"><ArrowRightIcon /></span>
      <div class="yir-stat">
        <span class="yir-stat-number">{formatDecimal(hoursWeekly)}</span>
        <span class="yir-stat-unit">{m.yir_label_per_week()}</span>
      </div>
      <span class="yir-stat-arrow"><ArrowRightIcon /></span>
      <div class="yir-stat">
        <span class="yir-stat-number">{formatDecimal(hoursDaily)}</span>
        <span class="yir-stat-unit">{m.yir_label_per_day()}</span>
      </div>
    </div>

    <div class="yir-separator"></div>

    <div class="yir-watched-stats">
      <div class="yir-stat">
        <span class="yir-stat-number">{formatNumber(stats.playCounts.total)}</span>
        <span class="yir-stat-unit">
          {specificType} {stats.playCounts.total === 1 ? "play" : "plays"}
        </span>
      </div>
      <div class="yir-stat">
        <span class="yir-stat-number">{formatDecimal(stats.playCounts.monthly)}</span>
        <span class="yir-stat-unit">{m.yir_label_per_month()}</span>
      </div>
      <span class="yir-stat-arrow"><ArrowRightIcon /></span>
      <div class="yir-stat">
        <span class="yir-stat-number">{formatDecimal(stats.playCounts.weekly)}</span>
        <span class="yir-stat-unit">{m.yir_label_per_week()}</span>
      </div>
      <span class="yir-stat-arrow"><ArrowRightIcon /></span>
      <div class="yir-stat">
        <span class="yir-stat-number">{formatDecimal(stats.playCounts.daily)}</span>
        <span class="yir-stat-unit">{m.yir_label_per_day()}</span>
      </div>
    </div>

    <div class="yir-separator"></div>

    {#if stats.distributions}
      <div class="yir-chart-container">
        <YirWeeklyPlaysChart data={stats.distributions.weekly} {year} />
      </div>
      <h2 class="yir-under-chart">{m.yir_label_plays_by_week({ type: specificType })}</h2>

      <div class="yir-charts-row">
        <div>
          <YirMonthlyPlaysChart data={stats.distributions.monthly} />
          <h2 class="yir-under-chart">{m.yir_label_plays_by_month({ type: specificType })}</h2>
        </div>
        <div>
          <YirDailyPlaysChart data={stats.distributions.days} />
          <h2 class="yir-under-chart">{m.yir_label_plays_by_day({ type: specificType })}</h2>
        </div>
      </div>

      {#if stats.distributions.hourly}
        <div class="yir-chart-container yir-chart-container-hourly">
          <YirHourlyPlaysChart data={stats.distributions.hourly} />
        </div>
        <h2 class="yir-under-chart">{m.yir_label_plays_by_hour({ type: specificType })}</h2>
      {/if}
    {/if}
  </div>
</section>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;
  @use "./shared" as *;

  .yir-stats-section {
    background-color: var(--shade-950);

    // Shared chart CSS variables
    --yir-chart-bar: #999;
    --yir-chart-bar-max: #fff;
    --yir-chart-bar-hover: #ab2425;
    --yir-chart-axis: #555;

    // Shared chart styles
    :global(.cds--cc--chart-wrapper) {
      background: transparent !important;
    }

    :global(.cds--cc--chart-svg) {
      background: transparent !important;
    }

    :global(.cds--cc--chart-holder) {
      background: transparent !important;
    }

    :global(svg) {
      background: transparent !important;
    }

    :global(g) {
      background: transparent !important;
    }

    :global(path[class*="bar fill"]) {
      transition: fill 0.15s ease;
      cursor: pointer;

      &:hover {
        fill: var(--yir-chart-bar-hover) !important;
      }
    }

    :global(.cds--cc--axis-title) {
      display: none;
    }

    :global(.cds--cc--axes g.axis g.tick text) {
      fill: var(--yir-chart-axis) !important;
      font-size: 11px !important;
      font-family: inherit !important;
    }

    :global(.cds--cc--grid line) {
      stroke: transparent !important;
    }

    :global(.cds--cc--grid rect.chart-grid-backdrop) {
      fill: none !important;
    }

    :global(.cds--cc--axis path) {
      stroke: var(--yir-chart-axis) !important;
    }

    :global(.cds--cc--axis line) {
      stroke: var(--yir-chart-axis) !important;
    }

    :global(.cds--tooltip),
    :global(.cds--cc--tooltip),
    :global(.cds--cc--tooltip-container) {
      background: transparent !important;
      background-color: transparent !important;
      border: none !important;
      box-shadow: none !important;
    }

    :global(.yir-chart-tooltip) {
      background: rgba(0, 0, 0, 0.92);
      border: 1px solid #3a3a3a;
      border-radius: 6px;
      padding: 8px 12px;
      color: #fff;
      font-family: inherit;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.6);
      text-align: center;
    }

    :global(.yir-chart-tooltip-plays) {
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 4px;
      color: #fff;
    }

    :global(.yir-chart-tooltip-week),
    :global(.yir-chart-tooltip-month),
    :global(.yir-chart-tooltip-day),
    :global(.yir-chart-tooltip-time) {
      font-size: 11px;
      opacity: 0.85;
    }

    :global(.yir-chart-tooltip-week) {
      margin-bottom: 2px;
    }

    :global(.yir-chart-tooltip-dates) {
      font-size: 10px;
      opacity: 0.65;
    }
  }

  .yir-page-inner {
    padding-bottom: 70px;

    @include for-mobile {
      padding-bottom: 40px;
    }
  }

  .yir-section-header {
    padding: 70px 0;

    @include for-mobile {
      padding: 40px 0;
    }
  }

  .yir-watched-stats {
    display: flex;
    align-items: center;
    padding: 0 10% 40px 10%;

    &:last-of-type {
      padding-bottom: 20px;
    }

    @include for-tablet-sm-and-below {
      padding-left: 5%;
      padding-right: 5%;
    }

    @include for-mobile {
      padding-left: 3%;
      padding-right: 3%;
      flex-wrap: wrap;

      .yir-stat {
        width: 50%;
        flex: none;
        margin-bottom: 15px;
      }
    }
  }

  .yir-stat {
    flex: 1;
    text-align: center;
  }

  .yir-stat-arrow {
    display: flex;
    align-items: center;
    color: #444;
    flex-shrink: 0;
    padding: 0 8px;

    :global(svg) {
      width: 32px;
      height: 32px;
    }

    @include for-mobile {
      display: none;
    }
  }

  .yir-stat-number {
    display: block;
    font-size: 60px;
    font-weight: bold;
    line-height: 1;
    color: #fff;

    @include for-tablet-sm-and-below {
      font-size: 45px;
    }

    @include for-mobile {
      font-size: 30px;
    }
  }

  .yir-stat-unit {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    font-size: 14px;
    text-transform: uppercase;
    color: #aaa;
    margin-top: 0;

    @include for-mobile {
      font-size: 13px;
    }
  }

  .yir-separator {
    border-bottom: 1px dashed #333;
    margin: 40px 0;
  }

  .yir-under-chart {
    font-size: 14px;
    text-transform: uppercase;
    color: #aaa;
    margin: 15px 0 0 0;
    text-align: center;
  }

  .yir-charts-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--gap-xl);
    margin-top: 70px;

    @include for-mobile {
      grid-template-columns: 1fr;
      margin-top: 50px;
    }
  }

  .yir-chart-container {
    margin-top: 70px;
    overflow-x: auto;
    overflow-y: hidden;

    @include for-mobile {
      margin-left: -20px;
      margin-right: -20px;
      padding-left: 20px;
      padding-right: 20px;
      margin-top: 50px;
    }

    /* Hide scrollbar but keep functionality */
    scrollbar-width: thin;
    scrollbar-color: #333 transparent;

    &::-webkit-scrollbar {
      height: 6px;
    }

    &::-webkit-scrollbar-track {
      background: transparent;
    }

    &::-webkit-scrollbar-thumb {
      background: #333;
      border-radius: 3px;
    }
  }
</style>
