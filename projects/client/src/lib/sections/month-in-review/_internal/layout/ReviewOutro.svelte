<script lang="ts">
  import CaretLeftIcon from "$lib/components/icons/CaretLeftIcon.svelte";
  import CaretRightIcon from "$lib/components/icons/CaretRightIcon.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import { languageTag } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages.ts";
  import { toHumanMonth } from "$lib/utils/formatting/date/toHumanMonth";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import type { Snippet } from "svelte";
  import { isPastMonth } from "../data/isPastMonth.ts";
  import { toAdjacentMonth } from "../data/toAdjacentMonth.ts";

  const {
    slug,
    year,
    month,
    showYear = false,
    actions,
  }: {
    slug: string;
    year: number;
    month: number;
    showYear?: boolean;
    actions?: Snippet;
  } = $props();

  const toName = (y: number, value: number) =>
    toHumanMonth(new Date(y, value - 1, 1), languageTag());

  const previous = $derived(toAdjacentMonth({ year, month, offset: -1 }));
  const next = $derived(toAdjacentMonth({ year, month, offset: 1 }));
  const hasNext = $derived(isPastMonth(next));
  const nextName = $derived(toName(next.year, next.month));
  const previousName = $derived(toName(previous.year, previous.month));
</script>

<section class="trakt-month-review-outro">
  <span class="kicker bold">{m.month_review_outro_kicker()}</span>
  <h2 class="title">{m.month_review_outro_title({ month: nextName })}</h2>
  <div class="actions">
    <Link
      underline="none"
      href={UrlBuilder.users(slug).monthInReview(previous.year, previous.month)}
      label={previousName}
    >
      <span class="pill"><CaretLeftIcon />{previousName}</span>
    </Link>
    {#if hasNext}
      <Link
        underline="none"
        href={UrlBuilder.users(slug).monthInReview(next.year, next.month)}
        label={nextName}
      >
        <span class="pill">{nextName}<CaretRightIcon /></span>
      </Link>
    {/if}
    {#if showYear}
      <Link
        underline="none"
        href={UrlBuilder.users(slug).yearToDate(year)}
        label={m.month_review_year_so_far({ year })}
      >
        <span class="pill">{m.month_review_year_so_far({ year })}</span>
      </Link>
    {/if}
    {@render actions?.()}
  </div>
</section>

<style>
  .trakt-month-review-outro {
    display: flex;
    flex-direction: column;
    gap: var(--gap-m);
    padding-top: var(--ni-56);
    border-top: 1px solid var(--color-month-review-hairline);
  }

  .kicker {
    font-size: var(--font-size-text-small);
    letter-spacing: 0.13em;
    text-transform: uppercase;
    color: var(--color-text-secondary);
  }

  .title {
    margin: 0;
    font-size: clamp(var(--ni-36), 5vw, var(--ni-64));
    font-weight: 700;
    letter-spacing: -0.04em;
    line-height: 0.95;
    text-wrap: balance;
  }

  .actions {
    display: flex;
    flex-wrap: wrap;
    gap: var(--gap-s);
  }

  .pill {
    display: inline-flex;
    align-items: center;
    gap: var(--gap-xs);
    height: var(--ni-36);
    padding-inline: var(--gap-m);
    border-radius: var(--border-radius-pill);
    background: var(--color-month-review-tile);
    color: var(--color-text-primary);

    :global(svg) {
      width: var(--ni-14);
      height: var(--ni-14);
    }
  }
</style>
