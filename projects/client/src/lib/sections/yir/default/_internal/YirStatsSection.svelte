<script lang="ts">
  import type { YirStatsCategory } from "$lib/requests/models/YirDetail";
  import ArrowRightIcon from "$lib/components/icons/ArrowRightIcon.svelte";
  import YirWeeklyPlaysChart from "./YirWeeklyPlaysChart.svelte";
  import YirMonthlyPlaysChart from "./YirMonthlyPlaysChart.svelte";
  import YirDailyPlaysChart from "./YirDailyPlaysChart.svelte";
  import YirHourlyPlaysChart from "./YirHourlyPlaysChart.svelte";
  import { m } from "$lib/paraglide/messages";
  import { formatNumber } from "$lib/utils/format/formatNumber";
  import YirSectionHeader from "./YirSectionHeader.svelte";
  import YirPageInner from "./YirPageInner.svelte";

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
  <YirPageInner>
    <YirSectionHeader>
      <strong>{formatNumber(stats.itemsCount ?? 0)}</strong> {sectionTitle}
    </YirSectionHeader>

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
  </YirPageInner>
</section>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .yir-stats-section {
    background-color: var(--shade-950);
    padding-bottom: var(--ni-72);

    @include for-mobile {
      padding-bottom: var(--ni-40);
    }
  }

  .yir-watched-stats {
    display: flex;
    align-items: center;
    padding: 0 10% var(--ni-40) 10%;

    &:last-of-type {
      padding-bottom: var(--ni-20);
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
        margin-bottom: var(--ni-16);
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
    color: var(--shade-700);
    flex-shrink: 0;
    padding: 0 var(--ni-8);

    :global(svg) {
      width: var(--ni-32);
      height: var(--ni-32);
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
    color: var(--shade-10);

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
    gap: var(--gap-xxs);
    font-size: 14px;
    text-transform: uppercase;
    color: var(--shade-300);
    margin-top: 0;

    @include for-mobile {
      font-size: 13px;
    }
  }

  .yir-separator {
    border-bottom: var(--border-thickness-xxs) dashed var(--shade-800);
    margin: var(--ni-40) 0;
  }

  .yir-under-chart {
    font-size: 14px;
    text-transform: uppercase;
    color: var(--shade-300);
    margin: var(--ni-16) 0 0 0;
    text-align: center;
  }

  .yir-charts-row {
    display: grid;
    // minmax(0, 1fr) lets the columns shrink below their content's
    // min-size. Carbon's BarChart uses an explicit pixel width (set
    // from the observed container width), and a plain `1fr` defaults to
    // `minmax(auto, 1fr)`, which won't shrink past that pixel value
    // when the viewport narrows.
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: var(--gap-xl);
    margin-top: var(--ni-72);

    // Extra horizontal breathing room around the charts on smaller
    // screens so the bars don't hug the viewport edges.
    @include for-tablet-sm-and-below {
      padding: 0 var(--ni-20);
    }

    @include for-mobile {
      grid-template-columns: 1fr;
      margin-top: var(--ni-52);
    }
  }

  .yir-chart-container {
    margin-top: var(--ni-72);
    overflow-x: auto;
    overflow-y: hidden;
    /* Hide scrollbar but keep functionality */
    scrollbar-width: thin;
    scrollbar-color: var(--shade-800) transparent;

    // Extra horizontal breathing room around the charts on smaller
    // screens so the bars don't hug the viewport edges.
    @include for-tablet-sm-and-below {
      padding-left: var(--ni-20);
      padding-right: var(--ni-20);
    }

    @include for-mobile {
      margin-top: var(--ni-52);
    }

    &::-webkit-scrollbar {
      height: var(--ni-6);
    }

    &::-webkit-scrollbar-track {
      background: transparent;
    }

    &::-webkit-scrollbar-thumb {
      background: var(--shade-800);
      border-radius: var(--border-radius-xs);
    }
  }
</style>
