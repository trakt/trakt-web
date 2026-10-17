<script lang="ts">
  import ClockIcon from "$lib/components/icons/ClockIcon.svelte";
  import PlayIcon from "$lib/components/icons/PlayIcon.svelte";
  import { languageTag } from "$lib/features/i18n";
  import { m } from "$lib/paraglide/messages";
  import type { YirStatsCategory } from "$lib/requests/models/YirDetail";
  import { formatDecimal } from "$lib/utils/format/formatDecimal";
  import { formatNumber } from "$lib/utils/format/formatNumber";
  import { toHumanClockTime } from "$lib/utils/formatting/date/toHumanClockTime";
  import { toHumanMonth } from "$lib/utils/formatting/date/toHumanMonth";
  import { toHumanShortDate } from "$lib/utils/formatting/date/toHumanShortDate";
  import { addDays } from "date-fns/addDays";
  import { setMonth } from "date-fns/setMonth";
  import { startOfYear } from "date-fns/startOfYear";

  import MessageWithBold from "$lib/components/text/MessageWithBold.svelte";
  import YirTooltip from "../../_internal/YirTooltip.svelte";
  import Yir2024LineChart from "./Yir2024LineChart.svelte";
  import Yir2024SectionHeader from "./Yir2024SectionHeader.svelte";
  import Yir2024WeeklyPlaysChart from "./Yir2024WeeklyPlaysChart.svelte";

  const {
    type,
    stats,
    year,
  }: {
    type: "shows" | "movies";
    stats: YirStatsCategory;
    year: number;
  } = $props();


  const itemsCount = $derived(stats.itemsCount ?? 0);
  const hoursTotal = $derived(Math.round(stats.minutes.total / 60));
  const playsTotal = $derived(stats.playCounts.total);

  const hoursMonthly = $derived(stats.minutes.monthly / 60);
  const hoursWeekly = $derived(stats.minutes.weekly / 60);
  const hoursDaily = $derived(stats.minutes.daily / 60);

  const peakWeek = $derived.by(() => {
    const weekly = stats.distributions?.weekly ?? [];
    if (weekly.length === 0) return null;
    const maxValue = Math.max(...weekly);
    const maxIndex = weekly.indexOf(maxValue);
    const start = addDays(startOfYear(new Date(year, 0, 1)), maxIndex * 7);
    const end = addDays(start, 6);
    const locale = languageTag();
    return {
      count: maxValue,
      start: toHumanShortDate(start, locale),
      end: toHumanShortDate(end, locale),
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
      ? m.yir_2024_stats_intro_shows({ year })
      : m.yir_2024_stats_intro_movies({ year }),
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

  // Hours chart data — 12 monthly buckets in user's locale.
  const monthlyHoursData = $derived.by(() => {
    const locale = languageTag();
    const monthly = stats.distributions?.monthly ?? [];
    return monthly.map((value, index) => ({
      // The distribution stores minutes per bucket; the card frames hours so
      // we convert before rendering.
      value: Math.round(value / 60),
      label: toHumanMonth(setMonth(new Date(0), index), locale, "short"),
    }));
  });

  // Plays chart data — 7 day-of-week buckets, with day names rendered in
  // the user's locale via Intl. Reference dates pinned to a known week
  // starting on Sunday (Jan 4, 2026 was a Sunday) so index 0 = Sun, …,
  // 6 = Sat regardless of the current date.
  const weekdayLabels = $derived.by(() => {
    const formatter = new Intl.DateTimeFormat(languageTag(), {
      weekday: "short",
    });
    return Array.from({ length: 7 }, (_, i) =>
      formatter.format(new Date(2026, 0, 4 + i)),
    );
  });
  const dailyPlaysData = $derived.by(() => {
    const days = stats.distributions?.days ?? [];
    return days.map((value, index) => ({
      value: Math.round(value),
      label: weekdayLabels[index] ?? "",
    }));
  });
</script>

<section class="trakt-yir-2024-stats-section" id="section-{type}-stats">
  <div class="yir-2024-stats-stack">
    <article class="yir-2024-stats-panel yir-2024-stats-summary">
      <div class="yir-2024-stats-summary-text">
        <Yir2024SectionHeader intro={introMessage} title={summaryMessage} />

        <div class="yir-2024-stats-info">
          {#if peakWeek}
            <p>
              <MessageWithBold
                message={m.yir_2024_stats_most_active_week({
                  start: peakWeek.start,
                  end: peakWeek.end,
                  count: formatNumber(peakWeek.count),
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

      {#if stats.distributions?.weekly}
        <div class="yir-2024-stats-summary-chart">
          <Yir2024WeeklyPlaysChart data={stats.distributions.weekly} {year} />
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
        <Yir2024LineChart data={monthlyHoursData}>
          {#snippet tooltip({ value, label })}
            <YirTooltip
              main={m.yir_2024_stats_tooltip_hours({
                count: formatNumber(value),
              })}
              sub={label}
            />
          {/snippet}
        </Yir2024LineChart>
      </div>

      <dl class="yir-2024-stats-averages">
        <div class="yir-2024-stats-average-row">
          <dt>{m.yir_2024_stats_per_month()}</dt>
          <dd class="bold">{formatDecimal(hoursMonthly)}</dd>
        </div>
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
        <Yir2024LineChart data={dailyPlaysData}>
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
          <dt>{m.yir_2024_stats_per_month()}</dt>
          <dd class="bold">{formatDecimal(stats.playCounts.monthly)}</dd>
        </div>
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
  @use "./yir2024StatsPanels" as *;

  .trakt-yir-2024-stats-section {
    width: 100%;
  }

  // Carbon renders tooltips inside the chart wrapper, which clips them with
  // its own overflow:hidden — on the short line cards the tooltip gets cut
  // off. Let tooltips overflow the chart wrapper into the (taller) panel so
  // the full box shows.
  .trakt-yir-2024-stats-section :global(.trakt-area-chart),
  .trakt-yir-2024-stats-section :global(.trakt-bar-chart) {
    overflow: visible;
  }

  @include yir-2024-stats-panels;
</style>
