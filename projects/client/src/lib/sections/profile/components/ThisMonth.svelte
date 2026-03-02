<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import MonthInReviewLink from "$lib/sections/components/MonthInReviewLink.svelte";
  import { getPreviousMonth } from "$lib/utils/date/getPreviousMonth";
  import { useMonthToDate } from "../stores/useMonthToDate";
  import WatchStats from "./_internal/WatchStats.svelte";

  const { slug }: { slug: string } = $props();

  const { monthToDate, isLoading } = $derived(useMonthToDate({ slug }));
  const mirDate = getPreviousMonth(new Date());
</script>

<div class="trakt-this-month">
  <span class="secondary bold">{m.text_this_month()}</span>
  <div class="trakt-this-month-content">
    <div class="trakt-this-month-stats">
      <WatchStats
        monthToDate={$monthToDate}
        isLoading={$isLoading}
        size="large"
      />
    </div>

    <MonthInReviewLink
      {slug}
      date={mirDate}
      source="month-to-date"
      variant="button"
    />
  </div>
</div>

<style>
  .trakt-this-month,
  .trakt-this-month-content {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);
  }

  .trakt-this-month {
    height: 100%;
    width: 100%;
    max-width: var(--ni-288);
  }

  .trakt-this-month-content {
    flex-grow: 1;
    justify-content: space-between;
  }

  .trakt-this-month-stats {
    flex-grow: 1;
    display: flex;
    align-items: center;
  }
</style>
