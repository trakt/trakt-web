<script lang="ts">
  import * as m from "$lib/features/i18n/messages";
  import { languageTag } from "$lib/features/i18n";
  import type { YirStatsCategory } from "$lib/requests/models/YirDetail";
  import { formatDecimal } from "$lib/utils/format/formatDecimal";
  import { formatNumber } from "$lib/utils/format/formatNumber";
  import { toHumanClockTime } from "$lib/utils/formatting/date/toHumanClockTime";
  import { toHumanMonth } from "$lib/utils/formatting/date/toHumanMonth";
  import { toHumanShortDate } from "$lib/utils/formatting/date/toHumanShortDate";
  import { addDays } from "date-fns/addDays";
  import { setMonth } from "date-fns/setMonth";
  import { yirMediaUnit } from "../../../_internal/yirMediaUnit";
  import { peakHour } from "./peakHour";
  import { peakWeek } from "./peakWeek";
  import { weekStart } from "./weekStart";
  import YirBars from "./YirBars.svelte";
  import YirCountUp from "./YirCountUp.svelte";
  import YirScene from "./YirScene.svelte";

  const {
    id,
    index,
    type,
    stats,
    year,
  }: {
    id: string;
    index: number;
    type: "shows" | "movies";
    stats: YirStatsCategory;
    year: number;
  } = $props();

  const hours = $derived(Math.round(stats.minutes.total / 60));
  const items = $derived(stats.itemsCount ?? 0);

  const weekly = $derived(
    (stats.distributions?.weekly ?? []).map((value, week) => {
      const start = weekStart(year, week);
      return {
        value,
        label: String(week + 1),
        main: m.yir_2024_stats_tooltip_plays({ count: formatNumber(value) }),
        sub: `${m.yir_2024_stats_tooltip_week_label({ week: String(week + 1) })} · ${toHumanShortDate(start, languageTag())} - ${toHumanShortDate(addDays(start, 6), languageTag())}`,
      };
    }),
  );

  const monthly = $derived(
    (stats.distributions?.monthly ?? []).map((value, month) => {
      const label = toHumanMonth(
        setMonth(new Date(0), month),
        languageTag(),
        "short",
      );
      return {
        value: value / 60,
        label,
        main: m.yir_2024_stats_tooltip_hours({
          count: formatNumber(Math.round(value / 60)),
        }),
        sub: toHumanMonth(setMonth(new Date(0), month), languageTag()),
      };
    }),
  );

  const weekdays = $derived.by(() => {
    const short = new Intl.DateTimeFormat(languageTag(), { weekday: "short" });
    const long = new Intl.DateTimeFormat(languageTag(), { weekday: "long" });

    return (stats.distributions?.days ?? []).map((value, day) => {
      const date = new Date(2026, 0, 4 + day);
      return {
        value,
        label: short.format(date),
        main: m.yir_2024_stats_tooltip_plays({ count: formatNumber(value) }),
        sub: long.format(date),
      };
    });
  });

  const topWeek = $derived.by(() => {
    const peak = peakWeek(stats.distributions?.weekly ?? [], year);
    if (!peak) return null;

    return {
      range: `${toHumanShortDate(peak.start, languageTag())} - ${toHumanShortDate(peak.end, languageTag())}`,
      plays: m.yir_2024_stats_card_plays({ count: formatNumber(peak.plays) }),
    };
  });

  const topHour = $derived.by(() => {
    const hour = peakHour(stats.distributions?.hourly ?? []);
    return hour === null
      ? null
      : toHumanClockTime(new Date(2000, 0, 1, hour), languageTag());
  });

  const rates = $derived([
    { key: "month", label: m.yir_2024_stats_per_month(), hours: stats.minutes.monthly / 60, plays: stats.playCounts.monthly },
    { key: "week", label: m.yir_2024_stats_per_week(), hours: stats.minutes.weekly / 60, plays: stats.playCounts.weekly },
    { key: "day", label: m.yir_2024_stats_per_day(), hours: stats.minutes.daily / 60, plays: stats.playCounts.daily },
  ]);

  const unit = $derived(
    type === "shows" ? m.yir_unit_episode() : m.yir_unit_movie(),
  );

  const kicker = $derived(
    type === "shows" ? m.yir_section_title_tv_shows() : m.yir_section_title_movies(),
  );
  const title = $derived(
    type === "shows"
      ? m.yir_2024_stats_intro_shows({ year })
      : m.yir_2024_stats_intro_movies({ year }),
  );
</script>

<YirScene {id} {index} {kicker} {title}>
  {#snippet children(isInView)}
    <div class="yir-stats-hero" data-reveal style:--d="calc(var(--yir-beat) * 2)">
      <span class="yir-stats-hours">
        <YirCountUp value={hours} active={isInView} format={(value) => formatNumber(Math.round(value))} />
      </span>
      <span class="yir-stats-of">
        {m.yir_2026_hours_of({ items: `${formatNumber(items)} ${yirMediaUnit(type, items)}` })}
      </span>
    </div>

    {#if weekly.length > 0}
      <div class="yir-stats-chart" data-reveal style:--d="calc(var(--yir-beat) * 2.8)">
        <span class="yir-stats-label">{m.yir_label_plays_by_week({ type: unit })}</span>
        <YirBars bars={weekly} active={isInView} labelEvery={4} height="clamp(var(--ni-120), 22vw, var(--ni-240))" />
      </div>
    {/if}

    <dl class="yir-stats-facts" data-reveal style:--d="calc(var(--yir-beat) * 3.6)">
      {#if topWeek}
        <div>
          <dt>{m.yir_2026_peak_week()}</dt>
          <dd>{topWeek.range}</dd>
          <span>{topWeek.plays}</span>
        </div>
      {/if}
      {#if topHour}
        <div>
          <dt>{m.yir_2026_peak_hour()}</dt>
          <dd>{topHour}</dd>
        </div>
      {/if}
    </dl>

    <div class="yir-stats-split">
      {#if monthly.length > 0}
        <div class="yir-stats-chart" data-reveal>
          <span class="yir-stats-label">{m.yir_2026_hours_by_month()}</span>
          <YirBars bars={monthly} active={isInView} />
        </div>
      {/if}
      {#if weekdays.length > 0}
        <div class="yir-stats-chart" data-reveal style:--d="calc(var(--yir-beat) * 1.2)">
          <span class="yir-stats-label">{m.yir_label_plays_by_day({ type: unit })}</span>
          <YirBars bars={weekdays} active={isInView} />
        </div>
      {/if}
    </div>

    <table class="yir-stats-rates" data-reveal>
      <thead>
        <tr>
          <th></th>
          <th scope="col">{m.yir_unit_hours()}</th>
          <th scope="col">{m.yir_unit_plays()}</th>
        </tr>
      </thead>
      <tbody>
        {#each rates as rate (rate.key)}
          <tr>
            <th scope="row">{rate.label}</th>
            <td>{formatDecimal(rate.hours)}</td>
            <td>{formatDecimal(rate.plays)}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  {/snippet}
</YirScene>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .yir-stats-hero {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    column-gap: var(--ni-24);
  }

  .yir-stats-hours {
    font-family: var(--yir-font-display);
    font-size: clamp(var(--ni-96), 20vw, var(--ni-240));
    line-height: 0.85;
    color: var(--color-yir-accent);
  }

  .yir-stats-of {
    font-family: var(--yir-font-display);
    font-size: clamp(var(--ni-24), 3.4vw, var(--ni-48));
    line-height: 1.05;
  }

  .yir-stats-chart {
    display: flex;
    flex-direction: column;
    gap: var(--ni-16);
    min-width: 0;
  }

  .yir-stats-label,
  .yir-stats-facts dt,
  .yir-stats-rates th {
    font-family: var(--yir-font-mono);
    font-size: var(--font-size-tag);
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--color-yir-text-muted);
    font-weight: 400;
  }

  .yir-stats-facts {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(var(--ni-240), 1fr));
    gap: var(--ni-32);
    margin: 0;

    div {
      display: flex;
      flex-direction: column;
      gap: var(--ni-6);
      padding-top: var(--ni-16);
      border-top: var(--ni-2) solid var(--color-yir-accent);
    }

    dd {
      margin: 0;
      font-family: var(--yir-font-display);
      font-size: clamp(var(--ni-28), 3.6vw, var(--ni-48));
      line-height: 1.05;
    }

    span {
      color: var(--color-yir-text-secondary);
    }
  }

  .yir-stats-split {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: var(--ni-48);

    @include for-tablet-lg {
      grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
    }

    @include for-desktop {
      grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
    }
  }

  .yir-stats-rates {
    width: 100%;
    border-collapse: collapse;

    th,
    td {
      padding: var(--ni-12) 0;
      border-bottom: var(--ni-1) solid var(--color-yir-separator);
      text-align: end;
    }

    th:first-child {
      text-align: start;
    }

    td {
      font-family: var(--yir-font-display);
      font-size: clamp(var(--ni-24), 3vw, var(--ni-40));
      font-variant-numeric: tabular-nums;
    }

    tbody th {
      font-family: var(--yir-font-body);
      font-size: var(--font-size-title);
      letter-spacing: 0;
      text-transform: none;
      color: var(--color-yir-text-secondary);
    }
  }

  .yir-stats-facts div {
    position: relative;
    border-top-color: transparent;

    &::before {
      content: "";
      position: absolute;
      top: calc(-1 * var(--ni-2));
      inset-inline: 0;
      height: var(--ni-2);
      background: var(--color-yir-accent);
      transform: scaleX(0);
      transform-origin: left center;
      transition: transform var(--yir-t-hero) var(--yir-ease) calc(var(--yir-beat) * 5);

      :global([dir="rtl"]) & {
        transform-origin: right center;
      }
    }
  }

  :global(.is-in) .yir-stats-facts div::before {
    transform: scaleX(1);
  }

  @media (prefers-reduced-motion: reduce) {
    .yir-stats-facts div::before {
      transform: scaleX(1);
      transition: none;
    }
  }

  .yir-stats-rates tbody tr td {
    transition: color var(--yir-t-quick) ease;
  }

  @media (hover: hover) {
    .yir-stats-rates tbody tr:hover td {
      color: var(--color-yir-text-accent);
    }
  }
</style>
