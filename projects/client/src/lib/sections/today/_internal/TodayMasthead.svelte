<script lang="ts">
  import Skeleton from "$lib/components/skeleton/Skeleton.svelte";
  import { getLocale } from "$lib/features/i18n/index.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import { toHumanDateRange } from "$lib/utils/formatting/date/toHumanDateRange.ts";
  import { toHumanWeekdayDate } from "$lib/utils/formatting/date/toHumanWeekdayDate.ts";
  import TodayDayLinks from "./TodayDayLinks.svelte";
  import type { TodayMastheadProps } from "./TodayMastheadProps.ts";
  import { toDayName } from "./toDayName.ts";

  const {
    days,
    selectedDay,
    range,
    counts,
    summary,
    isLoading,
    onChange,
  }: TodayMastheadProps = $props();

  const isWeek = $derived(selectedDay?.kind === "week");

  const dayLinks = $derived(
    days.map((day) => ({
      value: day.key,
      label: toDayName(day.kind),
      count: counts ? (counts[day.key] ?? null) : undefined,
    })),
  );
  const headline = $derived.by(() => {
    if (isWeek) return m.text_today_headline_week();
    return selectedDay ? toDayName(selectedDay.kind) : "";
  });
  const dateLine = $derived(
    isWeek
      ? toHumanDateRange({
        start: range.start,
        end: range.end,
        locale: getLocale(),
      })
      : toHumanWeekdayDate(selectedDay?.date ?? range.end, getLocale()),
  );
</script>

<header class="trakt-today-masthead">
  <div class="masthead-title">
    <p class="tag bold uppercase masthead-date">{dateLine}</p>
    <h2 class="masthead-headline">{headline}</h2>
    {#if summary}
      <p class="secondary masthead-summary">{summary}</p>
    {:else if isLoading}
      <div class="masthead-summary">
        <Skeleton width="var(--ni-200)" height="var(--ni-14)" />
      </div>
    {:else}
      <p class="secondary masthead-summary"></p>
    {/if}
  </div>

  <TodayDayLinks
    options={dayLinks}
    value={selectedDay?.key ?? ""}
    {onChange}
  />
</header>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-today-masthead {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    justify-content: space-between;
    gap: var(--gap-s) var(--gap-l);

    padding-top: var(--ni-10);

    @include for-tablet-sm-and-below {
      padding-top: var(--ni-16);
    }

    @include for-mobile {
      flex-direction: column;
      align-items: flex-start;
    }
  }

  .masthead-title {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xxs);
    min-width: 0;
  }

  .masthead-date {
    color: var(--color-text-emphasis);
    letter-spacing: 0.08em;
  }

  .masthead-headline {
    margin: 0;
    font-size: var(--ni-40);
    line-height: 1;
    letter-spacing: -0.02em;

    @include for-mobile {
      font-size: var(--ni-32);
    }
  }

  .masthead-summary {
    display: flex;
    align-items: center;
    min-height: var(--ni-20);
  }
</style>
