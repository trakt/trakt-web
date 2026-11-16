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

  const toPeriodLabel = (target: { year: number; month: number }) =>
    `${toLabel(target)} ${target.year}`;

  const periodLabel = $derived(toPeriodLabel({ year, month }));
  const periodSizers = $derived(
    Array.from({ length: 12 }, (_, index) =>
      toPeriodLabel({ year, month: index + 1 }),
    ),
  );
</script>

<header class="trakt-month-review-top-bar">
  <div class="who">
    {@render who?.()}
  </div>

  <div class="timeline">
    <span class="period bold">
      <span class="period-label">{periodLabel}</span>
      {#each periodSizers as sizer, index (index)}
        <span class="period-sizer" aria-hidden="true">{sizer}</span>
      {/each}
    </span>

    <div class="previous">
      <Link
        underline="none"
        href={UrlBuilder.users(slug).monthInReview(
          previous.year,
          previous.month,
        )}
        label={toLabel(previous)}
      >
        <span class="nav-button"><CaretLeftIcon /></span>
      </Link>
    </div>

    <div class="dots">
      <MonthDots {slug} {year} {month} />
    </div>

    <div class="next">
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
  </div>

  <div class="share">
    {@render actions?.()}
  </div>
</header>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-month-review-top-bar {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    grid-template-areas: "who timeline share";
    align-items: center;
    column-gap: var(--gap-s);
    min-height: var(--ni-72);
    padding-top: env(safe-area-inset-top, 0px);

    @include for-tablet-sm-and-below {
      grid-template-columns: minmax(0, 1fr) auto auto auto minmax(0, 1fr);
      grid-template-areas:
        "who previous period next share"
        "dots dots dots dots dots";
      column-gap: var(--gap-xs);
      row-gap: var(--gap-m);
      padding-block: var(--gap-s);
    }
  }

  .who {
    grid-area: who;
    display: flex;
    align-items: center;
    gap: var(--gap-s);
    min-width: 0;
  }

  .timeline {
    grid-area: timeline;
    position: relative;
    display: grid;
    grid-template-areas: "previous dots next";
    align-items: center;
    column-gap: var(--gap-s);

    @include for-tablet-sm-and-below {
      display: contents;
    }
  }

  .previous {
    grid-area: previous;
  }

  .next {
    grid-area: next;
  }

  .dots {
    grid-area: dots;
    display: flex;
    justify-content: center;
  }

  .share {
    grid-area: share;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    min-height: var(--ni-40);
  }

  .period {
    display: grid;
    position: absolute;
    top: 100%;
    inset-inline: 0;
    width: max-content;
    min-width: var(--ni-104);
    margin-inline: auto;
    text-align: center;
    font-size: var(--font-size-text-small);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    white-space: nowrap;
    font-variant-numeric: tabular-nums;

    @include for-tablet-sm-and-below {
      position: static;
      grid-area: period;
    }
  }

  .period-label,
  .period-sizer {
    grid-area: 1 / 1;
  }

  .period-sizer {
    visibility: hidden;
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
