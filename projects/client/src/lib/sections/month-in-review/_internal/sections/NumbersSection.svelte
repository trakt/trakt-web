<script lang="ts">
  import { getLocale, languageTag } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages.ts";
  import { toHumanNumber } from "$lib/utils/formatting/number/toHumanNumber";
  import LedgerSection from "../layout/LedgerSection.svelte";
  import Stat from "../layout/Stat.svelte";
  import Tile from "../layout/Tile.svelte";
  import TileGrid from "../layout/TileGrid.svelte";
  import type { MonthReview } from "../models/MonthReview.ts";
  import BarChart from "../parts/BarChart.svelte";
  import HourDial from "../parts/HourDial.svelte";
  import FactGrid from "../parts/FactGrid.svelte";
  import { toDurationLabel } from "../parts/toDurationLabel.ts";
  import { toPlaysLabel } from "../parts/toPlaysLabel.ts";
  import { toChange } from "./toChange.ts";
  import { toPeakLabels } from "./toPeakLabels.ts";
  import { toHumanHour } from "$lib/utils/formatting/date/toHumanHour.ts";
  import { toPercentage } from "$lib/utils/formatting/number/toPercentage.ts";

  const {
    review,
    year,
    month,
    previousMonthName,
  }: {
    review: MonthReview;
    year: number;
    month: number;
    previousMonthName: string;
  } = $props();

  const locale = getLocale();
  const count = (value: number) => toHumanNumber(value, locale);
  const toNote = (change: ReturnType<typeof toChange>) =>
    change
      ? `${change.label} ${m.month_review_vs_previous({ month: previousMonthName })}`
      : undefined;

  const playsChange = $derived(
    review.previous
      ? toChange({
          current: review.plays,
          previous: review.previous.plays,
          locale,
        })
      : null,
  );
  const hoursChange = $derived(
    review.previous && review.minutes !== undefined
      ? toChange({
          current: review.minutes,
          previous: review.previous.minutes,
          locale,
        })
      : null,
  );
  const activity = $derived(
    [
      {
        key: "rated",
        value: review.ratingsCount,
        label: m.month_review_label_rated(),
      },
      {
        key: "comments",
        value: review.commentsCount,
        label: m.month_review_label_comments(),
      },
      {
        key: "lists",
        value: review.listsCount,
        label: m.month_review_label_lists(),
      },
    ].flatMap(({ key, value, label }) =>
      value === undefined ? [] : [{ key, value, label }],
    ),
  );

  const dayFormat = new Intl.DateTimeFormat(languageTag(), {
    weekday: "short",
    day: "numeric",
  });
  const toHour = (hour: number) =>
    toHumanHour(new Date(year, month - 1, 1, hour), languageTag());

  const isWeekend = (date: Date) => date.getDay() === 0 || date.getDay() === 6;

  const dailyItems = $derived(
    (review.dailyPlays ?? []).map((value, index) => {
      const date = new Date(year, month - 1, index + 1);
      return {
        value,
        label: dayFormat.format(date),
        valueLabel: toPlaysLabel(value),
        axisLabel:
          index === 0 || (index + 1) % 5 === 0 ? String(index + 1) : undefined,
        tone: isWeekend(date) ? ("weekend" as const) : ("default" as const),
      };
    }),
  );

  const MONDAY_FIRST = [1, 2, 3, 4, 5, 6, 0];
  const SUNDAY = new Date(2026, 0, 4);
  const weekdayShort = new Intl.DateTimeFormat(languageTag(), {
    weekday: "short",
  });
  const weekdayLong = new Intl.DateTimeFormat(languageTag(), {
    weekday: "long",
  });
  const toWeekday = (index: number) =>
    new Date(SUNDAY.getFullYear(), SUNDAY.getMonth(), SUNDAY.getDate() + index);

  const weekItems = $derived(
    review.weekdayPlays
      ? MONDAY_FIRST.map((index) => {
          const value = review.weekdayPlays?.at(index) ?? 0;
          const label = weekdayShort.format(toWeekday(index));
          return {
            value: Math.round(value),
            label,
            valueLabel: toPlaysLabel(Math.round(value)),
            axisLabel: label,
          };
        })
      : [],
  );
  const busiestWeekday = $derived.by(() => {
    const plays = review.weekdayPlays ?? [];
    const max = Math.max(0, ...plays);
    if (max === 0) return undefined;
    return {
      day: weekdayLong.format(toWeekday(plays.indexOf(max))),
      plays: toPlaysLabel(Math.round(max)),
    };
  });
  const hourlyItems = $derived(
    (review.hourlyPlays ?? []).map((value, hour) => {
      const label = toHour(hour);
      return {
        value,
        label,
        valueLabel: toPlaysLabel(value),
        axisLabel: hour % 6 === 0 ? label : undefined,
      };
    }),
  );

  const activeDaysChange = $derived(
    review.previous?.activeDays !== undefined && review.activeDays !== undefined
      ? toChange({
          current: review.activeDays,
          previous: review.previous.activeDays,
          locale,
        })
      : null,
  );
  const perDayChange = $derived(
    review.previous && review.minutesPerDay !== undefined
      ? toChange({
          current: review.minutesPerDay,
          previous: review.previous.minutesPerDay,
          locale,
        })
      : null,
  );

  const EVENING_HOUR = 20;
  const afterHours = $derived.by(() => {
    const hourly = review.hourlyPlays ?? [];
    const total = hourly.reduce((sum, plays) => sum + plays, 0);
    if (total === 0) return undefined;
    const evening = hourly
      .slice(EVENING_HOUR)
      .reduce((sum, plays) => sum + plays, 0);
    return {
      percent: toPercentage(evening / total, locale),
      hour: toHour(EVENING_HOUR),
    };
  });

  const peaks = $derived(
    toPeakLabels({
      dailyPlays: review.dailyPlays,
      hourlyPlays: review.hourlyPlays,
      year,
      month,
      locale: languageTag(),
    }),
  );
</script>

<LedgerSection label={m.month_review_section_numbers()}>
  <div class="summary">
    <FactGrid>
      <Stat
        value={review.plays}
        label={m.month_review_label_plays()}
        note={toNote(playsChange)}
        trend={playsChange?.trend}
      />
      {#if review.minutes !== undefined}
        <Stat
          value={Math.round(review.minutes / 60)}
          label={m.month_review_label_hours()}
          note={toNote(hoursChange)}
          trend={hoursChange?.trend}
        />
      {/if}
      {#if review.activeDays !== undefined}
        <Stat
          value={review.activeDays}
          label={m.month_review_label_active_days()}
          note={toNote(activeDaysChange)}
          trend={activeDaysChange?.trend}
        />
      {/if}
      {#if review.minutesPerDay !== undefined}
        <Stat
          value={toDurationLabel(review.minutesPerDay)}
          label={m.month_review_label_hours_per_day()}
          note={toNote(perDayChange)}
          trend={perDayChange?.trend}
        />
      {/if}
    </FactGrid>

    {#if activity.length > 0}
      <ul class="activity">
        {#each activity as item (item.key)}
          <li>
            <strong>{count(item.value)}</strong>
            <span class="bold small">{item.label}</span>
          </li>
        {/each}
      </ul>
    {/if}
  </div>

  {#if review.dailyPlays || review.hourlyPlays || weekItems.length > 0}
    <TileGrid>
      {#if review.dailyPlays}
        <Tile>
          <div class="tile-head">
            <h3>{m.month_review_day_by_day()}</h3>
            {#if peaks.day}
              <span>{m.month_review_busiest_day({ date: peaks.day })}</span>
            {/if}
            <span class="legend"><i></i>{m.month_review_weekends()}</span>
          </div>
          <BarChart items={dailyItems} />
        </Tile>
      {/if}
      {#if review.hourlyPlays}
        <Tile span={weekItems.length > 0 ? 3 : 6}>
          <div class="tile-head">
            <h3>{m.month_review_prime_time()}</h3>
            {#if peaks.hour}
              <span>{m.month_review_peak_hour({ hour: peaks.hour })}</span>
            {/if}
            {#if afterHours}
              <span>{m.month_review_after_hours(afterHours)}</span>
            {/if}
          </div>
          <HourDial items={hourlyItems} />
        </Tile>
      {/if}
      {#if weekItems.length > 0}
        <Tile span={review.hourlyPlays ? 3 : 6}>
          <div class="tile-head">
            <h3>{m.month_review_your_week()}</h3>
            {#if busiestWeekday}
              <span>{m.month_review_weekday_lead(busiestWeekday)}</span>
            {/if}
          </div>
          <BarChart items={weekItems} />
        </Tile>
      {/if}
    </TileGrid>
  {/if}
</LedgerSection>

<style>
  .summary {
    display: flex;
    flex-direction: column;
    padding-bottom: var(--gap-l);
  }

  .activity {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    gap: var(--gap-xs) var(--gap-l);
    font-size: var(--font-size-text-small);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--color-text-secondary);

    strong {
      color: var(--color-text-primary);
    }
  }

  .tile-head {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xxs);

    h3 {
      margin: 0;
      font-size: var(--font-size-title);
    }

    span {
      color: var(--color-text-secondary);
    }

    .legend {
      display: inline-flex;
      align-items: center;
      gap: var(--gap-xs);
      font-size: var(--font-size-text-small);

      i {
        width: var(--ni-10);
        height: var(--ni-10);
        border-radius: var(--border-radius-xs);
        background: var(--viz-5);
      }
    }
  }
</style>
