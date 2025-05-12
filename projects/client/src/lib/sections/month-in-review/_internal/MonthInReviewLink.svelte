<script lang="ts">
  import YearToDateArrow from "$lib/components/icons/YearToDateArrow.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import { languageTag } from "$lib/features/i18n";
  import { toHumanMonth } from "$lib/utils/formatting/date/toHumanMonth";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";

  const { slug, token, date }: { slug: string; token: string; date: Date } =
    $props();

  const { user } = useUser();

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const previousMonth = toHumanMonth(date, languageTag());

  // FIXME: always use iframe route when the kinks are ironed out
  const target = $derived($user.isDirector ? "_self" : "_blank");
  const href = $derived(
    $user.isDirector
      ? UrlBuilder.users(slug).monthInReview(year, month)
      : UrlBuilder.og.monthInReview(slug, token),
  );
</script>

<div class="trakt-month-in-review-link">
  <Link {href} {target}>
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
