<script lang="ts">
  import ExternalLinkIcon from "$lib/components/icons/ExternalLinkIcon.svelte";
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
    <ExternalLinkIcon />
    <p class="uppercase bold">{previousMonth}</p>
  </Link>
</div>

<style>
  .trakt-month-in-review-link {
    :global(.trakt-link) {
      text-decoration: none;

      display: flex;
      align-items: center;
      gap: var(--gap-xs);

      color: var(--shade-10);
    }

    :global(svg) {
      width: var(--ni-18);
      height: var(--ni-18);

      color: var(--shade-10);
    }
  }
</style>
