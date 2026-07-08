<script lang="ts">
  import { m } from "$lib/paraglide/messages";
  import type { YirYear } from "$lib/requests/models/YirYear";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";

  import ReviewHeader from "./ReviewHeader.svelte";

  const {
    slug,
    year,
  }: {
    slug: string;
    year: YirYear;
  } = $props();

  const currentYear = new Date().getFullYear();
  const isAllTime = $derived(year === "all");
  const numericYear = $derived(year === "all" ? currentYear : year);
  const isCurrentYear = $derived(year === currentYear);

  // Period nav loops: …2023 → 2024 → current year → all-time → (current year).
  // All-time is the terminal step, so it has no "next".
  const hasNext = $derived(!isAllTime);

  const periodLabel = $derived(
    isCurrentYear ? m.yir_title_year_to_date() : m.yir_title_year_in_review(),
  );
  const yearLabel = $derived(isAllTime ? m.yir_label_all_time() : String(year));

  const prevYearUrl = $derived(
    isAllTime
      ? UrlBuilder.users(slug).yearToDate(currentYear)
      : UrlBuilder.users(slug).yearToDate(numericYear - 1),
  );
  const nextYearUrl = $derived(
    numericYear < currentYear
      ? UrlBuilder.users(slug).yearToDate(numericYear + 1)
      : UrlBuilder.users(slug).allTime(),
  );

  const shareText = $derived(
    isAllTime
      ? m.yir_share_text_all_time()
      : m.yir_share_text({ year: numericYear }),
  );
</script>

<ReviewHeader
  {slug}
  prevUrl={prevYearUrl}
  nextUrl={nextYearUrl}
  canGoNext={hasNext}
  title={yearLabel}
  subtitle={isAllTime ? undefined : periodLabel}
  {shareText}
  sourceId="yir"
/>
