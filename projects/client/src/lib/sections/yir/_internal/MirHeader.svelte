<script lang="ts">
  import { languageTag } from "$lib/features/i18n";
  import { m } from "$lib/paraglide/messages";
  import { toHumanMonth } from "$lib/utils/formatting/date/toHumanMonth";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";

  import PeriodHeader from "./PeriodHeader.svelte";

  const {
    slug,
    year,
    month,
  }: {
    slug: string;
    year: number;
    /** 1-12. */
    month: number;
  } = $props();

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  // Step one month in either direction, rolling the year over at the bounds.
  const previous = $derived(
    month === 1 ? { year: year - 1, month: 12 } : { year, month: month - 1 },
  );
  const next = $derived(
    month === 12 ? { year: year + 1, month: 1 } : { year, month: month + 1 },
  );

  // Allow forward navigation up to (and including) the current month.
  const canGoNext = $derived(
    next.year < currentYear ||
      (next.year === currentYear && next.month <= currentMonth),
  );

  const monthName = $derived(
    toHumanMonth(new Date(year, month - 1, 1), languageTag()),
  );
  const periodLabel = $derived(`${monthName} ${year}`);

  const prevUrl = $derived(
    UrlBuilder.users(slug).monthInReview(previous.year, previous.month),
  );
  const nextUrl = $derived(
    UrlBuilder.users(slug).monthInReview(next.year, next.month),
  );

  const shareText = $derived(m.mir_share_text({ month: periodLabel }));
</script>

<PeriodHeader
  {slug}
  {prevUrl}
  {nextUrl}
  {canGoNext}
  title={periodLabel}
  subtitle={m.mir_title_month_in_review()}
  {shareText}
  sourceId="mir"
/>
