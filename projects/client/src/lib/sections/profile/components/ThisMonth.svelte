<script lang="ts">
  import * as m from '$lib/features/i18n/messages.ts';
  import MonthInReviewLink from '$lib/sections/components/MonthInReviewLink.svelte';
  import { getPreviousMonth } from '$lib/utils/date/getPreviousMonth';
  import { useMonthToDate } from '../stores/useMonthToDate';
  import StatsCard from './_internal/StatsCard.svelte';

  const { slug }: { slug: string } = $props();

  const { monthToDate, isLoading } = $derived(useMonthToDate({ slug }));
  const mirDate = getPreviousMonth(new Date());
</script>

<StatsCard title={m.text_this_month()} stats={$monthToDate} isLoading={$isLoading}>
  {#snippet footer()}
    <MonthInReviewLink {slug} date={mirDate} source="month-to-date" variant="button" />
  {/snippet}
</StatsCard>
