<script lang="ts">
  import YearToDateArrow from "$lib/components/icons/YearToDateArrow.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import { languageTag } from "$lib/features/i18n";
  import { toHumanMonth } from "$lib/utils/formatting/date/toHumanMonth";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";

  const { slug, token, date }: { slug: string; token: string; date: Date } =
    $props();

  const previousMonth = toHumanMonth(date, languageTag());
</script>

<div class="trakt-month-in-review-link">
  <Link href={UrlBuilder.og.monthInReview(slug, token)} target="_blank">
    <div class="trakt-month-in-review-label">
      <h5 class="uppercase">{previousMonth}</h5>
      <h5 class="uppercase">in review</h5>
    </div>
    <YearToDateArrow />
  </Link>
</div>

<style>
  .trakt-month-in-review-link {
    :global(.trakt-link) {
      text-decoration: none;

      display: flex;
      align-items: center;
      gap: var(--gap-m);
    }
  }

  .trakt-month-in-review-label {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }
</style>
