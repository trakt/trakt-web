<script lang="ts">
  import YearToDateArrow from "$lib/components/icons/YearToDateArrow.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import { languageTag } from "$lib/features/i18n";
  import { toHumanMonth } from "$lib/utils/formatting/date/toHumanMonth";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";

  const { slug, date }: { slug: string; date: Date } = $props();

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const previousMonth = toHumanMonth(date, languageTag());

  const href = $derived(UrlBuilder.users(slug).monthInReview(year, month));
</script>

<div class="trakt-month-in-review-link">
  <Link {href}>
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
