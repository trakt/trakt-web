<script lang="ts">
  import ClockIcon from "$lib/components/icons/ClockIcon.svelte";
  import PlayIcon from "$lib/components/icons/PlayIcon.svelte";
  import { languageTag } from "$lib/features/i18n";
  import { m } from "$lib/paraglide/messages";
  import type { YirStatsCategory } from "$lib/requests/models/YirDetail";
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

  const formatDecimal = (value: number) => value.toFixed(1);

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

      <div class="yir-2024-stats-watermark" aria-hidden="true">
        <span>{summaryMessage}</span>
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

      <div class="yir-2024-stats-watermark" aria-hidden="true">
        <span>{hoursCardTitle}</span>
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

      <div class="yir-2024-stats-watermark" aria-hidden="true">
        <span>{playsCardTitle}</span>
      </div>
    </article>
  </div>
</section>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-yir-2024-stats-section {
    width: 100%;
  }

  // Summary panel sits at full width on its own row; the two chart cards
  // share the row beneath in a 2-column grid that collapses to a single
  // column at tablet-sm-and-below. Tight 10px gap so the three panels
  // read as one continuous unit.
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

  // Shared panel chrome: rounded card with overflow:hidden so the watermark
  // text below clips at the bottom edge. --panel-padding-x exposes the
  // horizontal padding so children can bleed (negative margin) to the
  // panel edges and the watermark can match the inset.
  // The three panels (summary on top, hours + plays beneath) only round
  // their outer corners so they read as one continuous unit. Each panel
  // exposes --panel-radius so the size can step down on smaller screens.
  .yir-2024-stats-panel {
    --panel-padding-x: var(--ni-44);
    --panel-padding-top: var(--ni-44);
    --panel-padding-bottom: var(--ni-104);
    --panel-radius: var(--ni-64);

    position: relative;
    overflow: hidden;
    padding: var(--panel-padding-top) var(--panel-padding-x)
      var(--panel-padding-bottom);
    // Approximates v2's #112836 → #191C1E radial: a faint blue-tinged
    // center at the top fading out to a darker charcoal everywhere else.
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

  // Summary panel sits on top of the row pair: pill-rounded only on top.
  .yir-2024-stats-summary {
    border-top-left-radius: var(--panel-radius);
    border-top-right-radius: var(--panel-radius);
  }

  // Hours card is the bottom-left of the desktop row.
  .yir-2024-stats-card-hours {
    border-bottom-left-radius: var(--panel-radius);
  }

  // Plays card is the bottom-right of the desktop row.
  .yir-2024-stats-card-plays {
    border-bottom-right-radius: var(--panel-radius);
  }

  // Once the cards stack vertically (tablet-sm-and-below), the hours card
  // becomes the *middle* panel of the stack — drop its bottom corners — and
  // the plays card becomes the bottom of the stack, so both its bottom
  // corners pick up --panel-radius.
  @include for-tablet-sm-and-below {
    .yir-2024-stats-card-hours {
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
    }

    .yir-2024-stats-card-plays {
      border-bottom-left-radius: var(--panel-radius);
      border-bottom-right-radius: var(--panel-radius);
    }
  }

  // Summary panel: heading + info on the left, weekly bar chart on the right.
  // Stacks to a single column at tablet-sm-and-below.
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

    // The i18n strings embed <b> around dynamic values; render those as
    // bold purple inline highlights.
    :global(b) {
      color: var(--purple-300);
      font-weight: 700;
    }
  }

  // The chart bleeds to the panel edges (negative horizontal margin) so the
  // bar grid spans the full width of its column rather than sitting inside
  // the panel's content padding.
  .yir-2024-stats-summary-chart {
    min-width: 0;
    width: auto;
    margin: 0 calc(-1 * var(--panel-padding-x));

    @include for-tablet-sm-and-below {
      margin-left: 0;
      margin-right: 0;
    }
  }

  // Each chart card stretches to the full inner width — line chart inside
  // gets the entire row to render across. The card overrides the panel's
  // bottom padding to a tighter value so the watermark sits closer to the
  // averages list above it (no big empty gap between the two).
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

  // Same bleed treatment as the summary chart — let the line fill the
  // entire card width.
  .yir-2024-stats-card-chart {
    margin: var(--ni-16) calc(-1 * var(--panel-padding-x)) 0;
    min-width: 0;
  }

  // Averages list: each row's separator stretches edge-to-edge of the
  // panel. The list itself bleeds outward; rows pull the inset back in
  // via their own horizontal padding so the labels and values line up
  // with the rest of the panel content.
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

  // Faint repeated title at the bottom of each panel, partially clipped by
  // overflow:hidden. Plain font-size that steps down at smaller viewports
  // — no clamp / cqw cleverness so the size is predictable at every break.
  .yir-2024-stats-watermark {
    --watermark-inset: 0;
    --watermark-font-size: var(--ni-104);

    position: absolute;
    bottom: 0;
    left: var(--watermark-inset);
    right: var(--watermark-inset);
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
