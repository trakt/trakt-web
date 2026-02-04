<script lang="ts">
  import CalendarIcon from "$lib/components/icons/CalendarIcon.svelte";
  import * as m from "$lib/features/i18n/messages";
  import MonthInReviewLink from "$lib/sections/components/MonthInReviewLink.svelte";
  import ReviewContent from "$lib/sections/components/ReviewContent.svelte";
  import { getPreviousMonth } from "$lib/utils/date/getPreviousMonth";
  import { useMonthToDate } from "../stores/useMonthToDate";
  import WatchStats from "./_internal/WatchStats.svelte";
  import YearToDateLink from "./YearToDateLink.svelte";

  const SOURCE = "month-to-date";

  const { slug }: { slug: string } = $props();

  const mirDate = getPreviousMonth(new Date());

  const { monthToDate, isLoading } = $derived(useMonthToDate({ slug }));
</script>

<div class="trakt-month-to-date">
  <ReviewContent coverSrc={$monthToDate.coverUrl}>
    {#snippet header()}
      <div class="trakt-month-to-date-header-this-month">
        <CalendarIcon />
        <span class="bold uppercase">{m.text_this_month()}</span>
      </div>
      <YearToDateLink {slug} source={SOURCE} variant="compact" />
    {/snippet}

    <WatchStats monthToDate={$monthToDate} isLoading={$isLoading} />

    {#snippet footer()}
      <MonthInReviewLink {slug} date={mirDate} source={SOURCE} />
    {/snippet}
  </ReviewContent>
</div>

<style>
  .trakt-month-to-date {
    height: var(--ni-148);
  }

  .trakt-month-to-date-header-this-month {
    display: flex;
    align-items: center;
    gap: var(--gap-xs);
  }
</style>
