<script lang="ts">
  import CaretLeftIcon from "$lib/components/icons/CaretLeftIcon.svelte";
  import CaretRightIcon from "$lib/components/icons/CaretRightIcon.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import { languageTag } from "$lib/features/i18n";
  import { toHumanMonth } from "$lib/utils/formatting/date/toHumanMonth";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import type { Snippet } from "svelte";
  import { isPastMonth } from "../data/isPastMonth.ts";
  import { toAdjacentMonth } from "../data/toAdjacentMonth.ts";
  import MonthDots from "./MonthDots.svelte";

  const {
    slug,
    year,
    month,
    who,
    actions,
  }: {
    slug: string;
    year: number;
    month: number;
    who?: Snippet;
    actions?: Snippet;
  } = $props();

  const previous = $derived(toAdjacentMonth({ year, month, offset: -1 }));
  const next = $derived(toAdjacentMonth({ year, month, offset: 1 }));
  const canGoNext = $derived(isPastMonth(next));

  const toLabel = (target: { year: number; month: number }) =>
    toHumanMonth(new Date(target.year, target.month - 1, 1), languageTag());

  const periodLabel = $derived(`${toLabel({ year, month })} ${year}`);
</script>

<header class="trakt-month-review-top-bar">
  <div class="who">
    {@render who?.()}
  </div>

  <div class="dots">
    <MonthDots {slug} {year} {month} />
  </div>

  <div class="actions">
    {@render actions?.()}
    <Link
      underline="none"
      href={UrlBuilder.users(slug).monthInReview(previous.year, previous.month)}
      label={toLabel(previous)}
    >
      <span class="nav-button"><CaretLeftIcon /></span>
    </Link>
    <span class="period bold">{periodLabel}</span>
    {#if canGoNext}
      <Link
        underline="none"
        href={UrlBuilder.users(slug).monthInReview(next.year, next.month)}
        label={toLabel(next)}
      >
        <span class="nav-button"><CaretRightIcon /></span>
      </Link>
    {:else}
      <span class="nav-button is-disabled" aria-hidden="true">
        <CaretRightIcon />
      </span>
    {/if}
  </div>
</header>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-month-review-top-bar {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    gap: var(--gap-m);
    min-height: var(--ni-72);

    @include for-mobile {
      grid-template-columns: 1fr auto;
      row-gap: var(--gap-m);
      padding-block: var(--gap-s);

      .dots {
        grid-column: 1 / -1;
        order: 3;
        display: flex;
        justify-content: center;
      }
    }
  }

  .who {
    display: flex;
    align-items: center;
    gap: var(--gap-s);
    min-width: 0;
  }

  .actions {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: var(--gap-xs);
  }

  .period {
    min-width: var(--ni-104);
    text-align: center;
    font-size: var(--font-size-text-small);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    white-space: nowrap;
  }

  .nav-button {
    display: grid;
    place-items: center;
    width: var(--ni-36);
    height: var(--ni-36);
    border-radius: 50%;
    background: var(--color-month-review-tile);
    color: var(--color-text-primary);
    transition: background var(--transition-increment) ease-out;

    :global(svg) {
      width: var(--ni-14);
      height: var(--ni-14);
    }

    &.is-disabled {
      opacity: 0.4;
    }

    @include for-mouse {
      &:not(.is-disabled):hover {
        background: var(--color-month-review-track);
      }
    }
  }
</style>
