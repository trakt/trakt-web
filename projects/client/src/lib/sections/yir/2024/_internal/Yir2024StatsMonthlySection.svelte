<script lang="ts">
  import ClockIcon from "$lib/components/icons/ClockIcon.svelte";
  import PlayIcon from "$lib/components/icons/PlayIcon.svelte";
  import MessageWithBold from "$lib/components/text/MessageWithBold.svelte";
  import { languageTag } from "$lib/features/i18n";
  import { m } from "$lib/paraglide/messages";
  import type { YirStatsCategory } from "$lib/requests/models/YirDetail";
  import { formatNumber } from "$lib/utils/format/formatNumber";
  import { toHumanClockHour } from "$lib/utils/formatting/date/toHumanClockHour";
  import { toHumanClockTime } from "$lib/utils/formatting/date/toHumanClockTime";
  import { toHumanMonth } from "$lib/utils/formatting/date/toHumanMonth";
  import { toHumanShortDate } from "$lib/utils/formatting/date/toHumanShortDate";

  import YirTooltip from "../../_internal/YirTooltip.svelte";
  import Yir2024DailyPlaysChart from "./Yir2024DailyPlaysChart.svelte";
  import Yir2024LineChart from "./Yir2024LineChart.svelte";
  import Yir2024SectionHeader from "./Yir2024SectionHeader.svelte";

  const {
    type,
    stats,
    month,
    year,
  }: {
    type: "shows" | "movies";
    stats: YirStatsCategory;
    /** 1-12. */
    month: number;
    year: number;
  } = $props();

  const formatDecimal = (value: number) => value.toFixed(1);

  const itemsCount = $derived(stats.itemsCount ?? 0);
  const hoursTotal = $derived(Math.round(stats.minutes.total / 60));
  const playsTotal = $derived(stats.playCounts.total);

  // Month in Review surfaces per-week / per-day averages (no per-month row, as
  // the whole period is a single month).
  const hoursWeekly = $derived(stats.minutes.weekly / 60);
  const hoursDaily = $derived(stats.minutes.daily / 60);

  const monthName = $derived(
    toHumanMonth(new Date(year, month - 1, 1), languageTag()),
  );

  // Most active day within the month, from the per-day-of-month distribution.
  const peakDay = $derived.by(() => {
    const daily = stats.distributions?.daily ?? [];
    if (daily.length === 0) return null;
    const maxValue = Math.max(...daily);
    const maxIndex = daily.indexOf(maxValue);
    return {
      count: maxValue,
      date: toHumanShortDate(
        new Date(year, month - 1, maxIndex + 1),
        languageTag(),
      ),
    };
  });

  const peakHour = $derived.by(() => {
    const hourly = stats.distributions?.hourly;
    if (!hourly || hourly.length === 0) return null;
    const maxValue = Math.max(...hourly);
    const hour = hourly.indexOf(maxValue);
    return toHumanClockTime(new Date(2000, 0, 1, hour), languageTag());
  });

  const introMessage = $derived(
    type === "shows"
      ? m.yir_2024_stats_intro_shows_monthly({ month: monthName })
      : m.yir_2024_stats_intro_movies_monthly({ month: monthName }),
  );
  const summaryMessage = $derived(
    type === "shows"
      ? m.yir_2024_stats_summary_shows({
          hours: formatNumber(hoursTotal),
          count: formatNumber(itemsCount),
        })
      : m.yir_2024_stats_summary_movies({
          hours: formatNumber(hoursTotal),
          count: formatNumber(itemsCount),
        }),
  );

  const hoursCardTitle = $derived(
    m.yir_2024_stats_card_hours({ count: formatNumber(hoursTotal) }),
  );
  const playsCardTitle = $derived(
    m.yir_2024_stats_card_plays({ count: formatNumber(playsTotal) }),
  );

  // Daily-within-month plays power the summary's tall bar chart.
  const dailyPlaysData = $derived(stats.distributions?.daily ?? []);

  // Hours card line chart — plays distributed across the 24 hours of the day,
  // in the user's locale clock format.
  const hourlyHoursData = $derived.by(() => {
    const locale = languageTag();
    const hourly = stats.distributions?.hourly ?? [];
    return hourly.map((value, index) => ({
      value: Math.round(value),
      label: toHumanClockHour(new Date(2000, 0, 1, index), locale),
    }));
  });

  // Plays card line chart — 7 day-of-week buckets. Reference dates pinned to a
  // known week starting on Sunday (Jan 4, 2026) so index 0 = Sun … 6 = Sat.
  const weekdayLabels = $derived.by(() => {
    const formatter = new Intl.DateTimeFormat(languageTag(), {
      weekday: "short",
    });
    return Array.from({ length: 7 }, (_, i) =>
      formatter.format(new Date(2026, 0, 4 + i)),
    );
  });
  const dayOfWeekData = $derived.by(() => {
    const days = stats.distributions?.days ?? [];
    return days.map((value, index) => ({
      value: Math.round(value),
      label: weekdayLabels[index] ?? "",
    }));
  });
</script>

<section class="trakt-yir-2024-stats-monthly-section" id="section-{type}-stats">
  <div class="yir-2024-stats-stack">
    <article class="yir-2024-stats-panel yir-2024-stats-summary">
      <div class="yir-2024-stats-summary-text">
        <Yir2024SectionHeader intro={introMessage} title={summaryMessage} />

        <div class="yir-2024-stats-info">
          {#if peakDay}
            <p>
              <MessageWithBold
                message={m.yir_2024_stats_most_active_day({
                  date: peakDay.date,
                  count: formatNumber(peakDay.count),
                })}
              />
            </p>
          {/if}
          {#if peakHour}
            <p>
              <MessageWithBold
                message={m.yir_2024_stats_most_popular_time({ time: peakHour })}
              />
            </p>
          {/if}
        </div>
      </div>

      {#if dailyPlaysData.length > 0}
        <div class="yir-2024-stats-summary-chart">
          <Yir2024DailyPlaysChart data={dailyPlaysData} {month} {year} />
        </div>
      {/if}

      <div class="yir-2024-stats-watermark-clip" aria-hidden="true">
        <div class="yir-2024-stats-watermark">
          <span>{summaryMessage}</span>
        </div>
      </div>
    </article>

    <article
      class="yir-2024-stats-panel yir-2024-stats-card yir-2024-stats-card-hours"
    >
      <header class="yir-2024-stats-card-header">
        <h3 class="bold yir-2024-stats-card-title">{hoursCardTitle}</h3>
        <span class="yir-2024-stats-card-icon"><ClockIcon /></span>
      </header>

      <div class="yir-2024-stats-card-chart">
        <Yir2024LineChart data={hourlyHoursData}>
          {#snippet tooltip({ value, label })}
            <YirTooltip
              main={m.yir_2024_stats_tooltip_plays({
                count: formatNumber(value),
              })}
              sub={label}
            />
          {/snippet}
        </Yir2024LineChart>
      </div>

      <dl class="yir-2024-stats-averages">
        <div class="yir-2024-stats-average-row">
          <dt>{m.yir_2024_stats_per_week()}</dt>
          <dd class="bold">{formatDecimal(hoursWeekly)}</dd>
        </div>
        <div class="yir-2024-stats-average-row">
          <dt>{m.yir_2024_stats_per_day()}</dt>
          <dd class="bold">{formatDecimal(hoursDaily)}</dd>
        </div>
      </dl>

      <div class="yir-2024-stats-watermark-clip" aria-hidden="true">
        <div class="yir-2024-stats-watermark">
          <span>{hoursCardTitle}</span>
        </div>
      </div>
    </article>

    <article
      class="yir-2024-stats-panel yir-2024-stats-card yir-2024-stats-card-plays"
    >
      <header class="yir-2024-stats-card-header">
        <h3 class="bold yir-2024-stats-card-title">{playsCardTitle}</h3>
        <span class="yir-2024-stats-card-icon"><PlayIcon /></span>
      </header>

      <div class="yir-2024-stats-card-chart">
        <Yir2024LineChart data={dayOfWeekData}>
          {#snippet tooltip({ value, label })}
            <YirTooltip
              main={m.yir_2024_stats_tooltip_plays({
                count: formatNumber(value),
              })}
              sub={label}
            />
          {/snippet}
        </Yir2024LineChart>
      </div>

      <dl class="yir-2024-stats-averages">
        <div class="yir-2024-stats-average-row">
          <dt>{m.yir_2024_stats_per_week()}</dt>
          <dd class="bold">{formatDecimal(stats.playCounts.weekly)}</dd>
        </div>
        <div class="yir-2024-stats-average-row">
          <dt>{m.yir_2024_stats_per_day()}</dt>
          <dd class="bold">{formatDecimal(stats.playCounts.daily)}</dd>
        </div>
      </dl>

      <div class="yir-2024-stats-watermark-clip" aria-hidden="true">
        <div class="yir-2024-stats-watermark">
          <span>{playsCardTitle}</span>
        </div>
      </div>
    </article>
  </div>
</section>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  // Layout mirrors Yir2024StatsSection exactly (full-width summary on top, two
  // chart cards beneath) so the monthly and yearly stats read identically.
  .trakt-yir-2024-stats-monthly-section {
    width: 100%;
  }

  // Carbon renders tooltips inside the chart wrapper, which clips them with
  // its own overflow:hidden — on the short line cards the tooltip gets cut
  // off. Let tooltips overflow the chart wrapper into the (taller) panel so
  // the full box shows.
  .trakt-yir-2024-stats-monthly-section :global(.trakt-area-chart),
  .trakt-yir-2024-stats-monthly-section :global(.trakt-bar-chart) {
    overflow: visible;
  }

  .yir-2024-stats-stack {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: var(--ni-10);
  }

  .yir-2024-stats-summary {
    grid-column: 1 / -1;
  }

  @include for-tablet-sm-and-below {
    .yir-2024-stats-stack {
      grid-template-columns: 1fr;
    }
  }

  .yir-2024-stats-panel {
    --panel-padding-x: var(--ni-44);
    --panel-padding-top: var(--ni-44);
    --panel-padding-bottom: var(--ni-104);
    --panel-radius: var(--ni-64);

    position: relative;
    // overflow stays visible so chart tooltips can escape the panel; the
    // watermark is clipped by its own wrapper (.yir-2024-stats-watermark-clip).
    overflow: visible;
    padding: var(--panel-padding-top) var(--panel-padding-x)
      var(--panel-padding-bottom);
    background: radial-gradient(
      50% 39.27% at 50% 0%,
      color-mix(in srgb, var(--shade-950) 90%, var(--blue-500) 10%) 0%,
      color-mix(in srgb, var(--shade-950) 70%, var(--shade-900) 30%) 100%
    );

    @include for-mobile {
      --panel-padding-x: var(--ni-20);
      --panel-padding-top: var(--ni-20);
      --panel-padding-bottom: var(--ni-72);
      --panel-radius: var(--ni-32);
    }
  }

  .yir-2024-stats-summary {
    border-start-start-radius: var(--panel-radius);
    border-start-end-radius: var(--panel-radius);
  }

  .yir-2024-stats-card-hours {
    border-end-start-radius: var(--panel-radius);
  }

  .yir-2024-stats-card-plays {
    border-end-end-radius: var(--panel-radius);
  }

  @include for-tablet-sm-and-below {
    .yir-2024-stats-card-hours {
      border-end-start-radius: 0;
      border-end-end-radius: 0;
    }

    .yir-2024-stats-card-plays {
      border-end-start-radius: var(--panel-radius);
      border-end-end-radius: var(--panel-radius);
    }
  }

  .yir-2024-stats-summary {
    display: grid;
    grid-template-columns: minmax(0, 2fr) minmax(0, 3fr);
    gap: var(--ni-32);

    @include for-tablet-sm-and-below {
      grid-template-columns: 1fr;
      gap: var(--ni-24);
    }
  }

  .yir-2024-stats-summary-text {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: var(--ni-32);
  }

  .yir-2024-stats-info {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xxs);
    color: var(--shade-300);

    p {
      margin: 0;
      font-size: var(--font-size-text);
      line-height: 1.3;
    }

    :global(b) {
      color: var(--purple-300);
      font-weight: 700;
    }
  }

  .yir-2024-stats-summary-chart {
    min-width: 0;
    width: auto;

    @include for-tablet-sm-and-below {
      margin-inline-start: 0;
      margin-inline-end: 0;
    }
  }

  .yir-2024-stats-card {
    --height-area-chart: var(--ni-104);
    --panel-padding-bottom: var(--ni-64);

    display: flex;
    flex-direction: column;
    min-width: 0;

    @include for-mobile {
      --height-area-chart: var(--ni-72);
      --panel-padding-bottom: var(--ni-40);
    }
  }

  .yir-2024-stats-card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--gap-m);
  }

  .yir-2024-stats-card-title {
    margin: 0;
    font-size: var(--ni-32);

    @include for-mobile {
      font-size: var(--ni-22);
    }
  }

  .yir-2024-stats-card-icon {
    display: inline-flex;
    color: var(--shade-10);

    :global(svg) {
      width: var(--ni-28);
      height: var(--ni-28);
    }
  }

  .yir-2024-stats-card-chart {
    margin: var(--ni-16) calc(-1 * var(--panel-padding-x)) 0;
    min-width: 0;
  }

  .yir-2024-stats-averages {
    margin: var(--ni-16) calc(-1 * var(--panel-padding-x)) 0;
    padding: 0;
  }

  .yir-2024-stats-average-row {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    padding: var(--ni-10) var(--panel-padding-x);
    border-bottom: var(--border-thickness-xxs) solid var(--shade-800);

    &:last-child {
      border-bottom: none;
    }

    dt {
      margin: 0;
      font-size: var(--font-size-title);
      color: var(--shade-300);

      @include for-mobile {
        font-size: var(--font-size-text);
      }
    }

    dd {
      margin: 0;
      font-size: var(--font-size-title);
      color: var(--shade-10);

      @include for-mobile {
        font-size: var(--font-size-text);
      }
    }
  }

  // Clips the watermark to the panel box (and its rounded corners) so the
  // panel itself can stay overflow:visible for chart tooltips.
  .yir-2024-stats-watermark-clip {
    position: absolute;
    inset: 0;
    overflow: hidden;
    border-radius: inherit;
    pointer-events: none;
  }

  .yir-2024-stats-watermark {
    --watermark-inset: 0;
    --watermark-font-size: var(--ni-104);

    position: absolute;
    bottom: 0;
    inset-inline-start: var(--watermark-inset);
    inset-inline-end: var(--watermark-inset);
    transform: translateY(35%);
    text-align: center;
    font-family: inherit;
    font-weight: 600;
    font-size: var(--watermark-font-size);
    line-height: 1;
    letter-spacing: -0.02em;
    color: var(--shade-10);
    opacity: 0.05;
    pointer-events: none;
    user-select: none;

    @include for-tablet-lg-and-below {
      --watermark-font-size: var(--ni-72);
    }

    @include for-tablet-sm-and-below {
      --watermark-font-size: var(--ni-52);
    }

    @include for-mobile {
      --watermark-font-size: var(--ni-40);
    }

    span {
      display: block;
      font-family: inherit;
      white-space: nowrap;
      overflow: hidden;
      font-size: inherit;
      font-weight: inherit;
    }
  }
</style>
