<script lang="ts">
  import ArrowRightIcon from "$lib/components/icons/ArrowRightIcon.svelte";
  import { m } from "$lib/paraglide/messages";
  import type {
    YirStatsCategory,
    YirYearCount,
  } from "$lib/requests/models/YirDetail";
  import { formatNumber } from "$lib/utils/format/formatNumber";
  import { yirUnit } from "./yirUnit.ts";
  import YirDailyPlaysChart from "./YirDailyPlaysChart.svelte";
  import YirHourlyPlaysChart from "./YirHourlyPlaysChart.svelte";
  import YirMonthlyPlaysChart from "./YirMonthlyPlaysChart.svelte";
  import YirPageInner from "./YirPageInner.svelte";
  import YirSectionHeader from "./YirSectionHeader.svelte";
  import YirTooltip from "./YirTooltip.svelte";
  import YirWeeklyPlaysChart from "./YirWeeklyPlaysChart.svelte";
  import YirYearBarChart from "./YirYearBarChart.svelte";

  const {
    type,
    stats,
    year,
    yearlyPlays,
  }: {
    type: "shows" | "movies";
    stats: YirStatsCategory;
    year: number;
    /**
     * Plays per calendar year. All-time view only; when provided, an extra
     * "plays by year" chart is rendered above the weekly distribution.
     */
    yearlyPlays?: YirYearCount[];
  } = $props();

  const yearlyChartData = $derived(
    (yearlyPlays ?? []).map((d) => ({ label: String(d.year), value: d.count })),
  );

  const sectionTitle = $derived(
    type === "shows"
      ? m.yir_section_title_tv_shows()
      : m.yir_section_title_movies(),
  );
  // Localized singular noun ("episode"/"movie") used both as standalone text
  // and injected into the chart labels via the message {type} variable.
  const specificType = $derived(
    type === "shows" ? m.yir_unit_episode() : m.yir_unit_movie(),
  );

  function formatDecimal(value: number): string {
    return value.toFixed(1);
  }

  const hoursTotal = $derived(Math.round(stats.minutes.total / 60));
  const hoursMonthly = $derived(stats.minutes.monthly / 60);
  const hoursWeekly = $derived(stats.minutes.weekly / 60);
  const hoursDaily = $derived(stats.minutes.daily / 60);
</script>

<section class="trakt-yir-stats-section" id="section-{type}-stats">
  <YirPageInner>
    <YirSectionHeader>
      <strong>{formatNumber(stats.itemsCount ?? 0)}</strong>
      {sectionTitle}
    </YirSectionHeader>

    <div class="yir-watched-stats">
      <div class="yir-stat">
        <span class="yir-stat-number">{formatNumber(hoursTotal)}</span>
        <span class="yir-stat-unit">{m.yir_label_hours_watched()}</span>
      </div>
      <span class="yir-stat-arrow"><ArrowRightIcon /></span>
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
        <span class="yir-stat-number">
          {formatNumber(stats.playCounts.total)}
        </span>
        <span class="yir-stat-unit">
          {specificType}
          {yirUnit(stats.playCounts.total, m.yir_unit_play, m.yir_unit_plays)}
        </span>
      </div>
      <span class="yir-stat-arrow"><ArrowRightIcon /></span>
      <div class="yir-stat">
        <span class="yir-stat-number">
          {formatDecimal(stats.playCounts.monthly)}
        </span>
        <span class="yir-stat-unit">{m.yir_label_per_month()}</span>
      </div>
      <span class="yir-stat-arrow"><ArrowRightIcon /></span>
      <div class="yir-stat">
        <span class="yir-stat-number">
          {formatDecimal(stats.playCounts.weekly)}
        </span>
        <span class="yir-stat-unit">{m.yir_label_per_week()}</span>
      </div>
      <span class="yir-stat-arrow"><ArrowRightIcon /></span>
      <div class="yir-stat">
        <span class="yir-stat-number">
          {formatDecimal(stats.playCounts.daily)}
        </span>
        <span class="yir-stat-unit">{m.yir_label_per_day()}</span>
      </div>
    </div>

    <div class="yir-separator"></div>

    {#if yearlyChartData.length > 0}
      <div class="yir-chart-container">
        <YirYearBarChart data={yearlyChartData}>
          {#snippet tooltip({ value, label })}
            <YirTooltip
              main="{formatNumber(value)} {value === 1 ? 'play' : 'plays'}"
              sub={label}
            />
          {/snippet}
        </YirYearBarChart>
      </div>
      <h2 class="yir-under-chart">
        {m.yir_label_plays_by_year({ type: specificType })}
      </h2>
    {/if}

    {#if stats.distributions}
      <!-- The all-time view shows plays-by-year (above) instead of by-week. -->
      {#if yearlyChartData.length === 0}
        <div class="yir-chart-container">
          <YirWeeklyPlaysChart data={stats.distributions.weekly} {year}>
            {#snippet tooltip({ value, week, dateRange })}
              <YirTooltip
                main="{formatNumber(value)} {value === 1 ? 'play' : 'plays'}"
                sub="Week {week}"
                extra={dateRange}
              />
            {/snippet}
          </YirWeeklyPlaysChart>
        </div>
        <h2 class="yir-under-chart">
          {m.yir_label_plays_by_week({ type: specificType })}
        </h2>
      {/if}

      <div class="yir-charts-row">
        <div>
          <YirMonthlyPlaysChart data={stats.distributions.monthly} />
          <h2 class="yir-under-chart">
            {m.yir_label_plays_by_month({ type: specificType })}
          </h2>
        </div>
        <div>
          <YirDailyPlaysChart data={stats.distributions.days} />
          <h2 class="yir-under-chart">
            {m.yir_label_plays_by_day({ type: specificType })}
          </h2>
        </div>
      </div>

      {#if stats.distributions.hourly}
        <div class="yir-chart-container yir-chart-container-hourly">
          <YirHourlyPlaysChart data={stats.distributions.hourly} />
        </div>
        <h2 class="yir-under-chart">
          {m.yir_label_plays_by_hour({ type: specificType })}
        </h2>
      {/if}
    {/if}
  </YirPageInner>
</section>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-yir-stats-section {
    background-color: var(--color-yir-background);
    padding-bottom: var(--ni-72);

    @include for-mobile {
      padding-bottom: var(--ni-40);
    }
  }

  .yir-watched-stats {
    display: flex;
    align-items: flex-start;
    padding: 0 10% 0 10%;

    &:last-of-type {
      padding-bottom: var(--ni-20);
    }

    @include for-tablet-sm-and-below {
      padding-inline-start: 5%;
      padding-inline-end: 5%;
    }

    @include for-mobile {
      padding-inline-start: 3%;
      padding-inline-end: 3%;
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
    color: var(--color-yir-arrow);
    flex-shrink: 0;
    // Vertical offset = (number font-size − svg size) / 2, so the arrow
    // centers on the big number rather than on the row's flex-start baseline.
    padding: var(--ni-14) var(--ni-8) 0;

    // First arrow is hidden but still takes space so the columns align
    // identically across both stat rows.
    .yir-watched-stats > &:first-of-type {
      visibility: hidden;
    }

    :global(svg) {
      width: var(--ni-32);
      height: var(--ni-32);
    }

    @include for-tablet-sm-and-below {
      padding-top: var(--ni-6);
    }

    @include for-mobile {
      display: none;
    }
  }

  .yir-stat-number {
    display: block;
    font-size: var(--ni-48);
    font-weight: bold;
    line-height: 1;
    color: var(--color-yir-text-primary);

    @include for-tablet-sm-and-below {
      font-size: var(--ni-40);
    }

    @include for-mobile {
      font-size: var(--ni-30);
    }
  }

  .yir-stat-unit {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--gap-xxs);
    font-size: var(--font-size-text);
    text-transform: uppercase;
    color: var(--color-yir-text-secondary);
    margin-top: 0;

    @include for-mobile {
      font-size: var(--ni-12);
    }
  }

  .yir-separator {
    border-bottom: var(--border-thickness-xxs) dashed var(--color-yir-separator);
    margin: var(--ni-40) 0;
  }

  .yir-under-chart {
    font-size: var(--font-size-text);
    text-transform: uppercase;
    color: var(--color-yir-text-secondary);
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

    > div {
      min-width: 0;
      width: 100%;
    }

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
    scrollbar-color: var(--color-yir-separator) transparent;

    // Extra horizontal breathing room around the charts on smaller
    // screens so the bars don't hug the viewport edges.
    @include for-tablet-sm-and-below {
      padding-inline-start: var(--ni-20);
      padding-inline-end: var(--ni-20);
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
      background: var(--color-yir-separator);
      border-radius: var(--border-radius-xs);
    }
  }
</style>
