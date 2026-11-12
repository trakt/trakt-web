<script lang="ts">
  import { getLocale } from "$lib/features/i18n";
  import { toHumanNumber } from "$lib/utils/formatting/number/toHumanNumber";
  import { whenInViewport } from "$lib/utils/actions/whenInViewport";
  import { REVEAL_MARGIN } from "./REVEAL_MARGIN.ts";
  import type { Snippet } from "svelte";
  import type { MonthReviewShare } from "../models/MonthReviewShare.ts";

  const {
    items,
    meta,
  }: {
    items: ReadonlyArray<MonthReviewShare>;
    meta?: Snippet<[MonthReviewShare]>;
  } = $props();

  let isInView = $state(false);

  const max = $derived(Math.max(1, ...items.map((item) => item.count)));
</script>

<ul
  class="trakt-month-review-bar-list"
  class:is-in-view={isInView}
  use:whenInViewport={{
    callback: () => (isInView = true),
    rootMargin: REVEAL_MARGIN,
  }}
>
  {#each items as item, index (item.key)}
    <li>
      <span class="row">
        <span class="label">{item.label}</span>
        <span class="count">
          {@render meta?.(item)}
          {toHumanNumber(item.count, getLocale())}
        </span>
      </span>
      <span class="track">
        <i
          class:is-top={index === 0}
          style="--share: {item.count / max}; --index: {index}"
        ></i>
      </span>
    </li>
  {/each}
</ul>

<style>
  .trakt-month-review-bar-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: var(--gap-s);
  }

  .row {
    display: flex;
    justify-content: space-between;
    gap: var(--gap-s);
  }

  .label {
    text-transform: capitalize;
  }

  .count {
    display: inline-flex;
    align-items: center;
    gap: var(--gap-s);
    color: var(--color-text-secondary);
    font-variant-numeric: tabular-nums;
  }

  .track {
    display: block;
    height: var(--ni-8);
    margin-top: var(--gap-xxs);
    border-radius: var(--border-radius-pill);
    background: var(--color-month-review-track);
    overflow: hidden;

    i {
      display: block;
      height: 100%;
      width: calc(var(--share) * 100%);
      border-radius: inherit;
      background: var(--color-text-primary);
      transform-origin: left;
      scale: 0 1;
      transition: scale 800ms cubic-bezier(0.16, 1, 0.3, 1)
        calc(var(--index) * 60ms);

      &:dir(rtl) {
        transform-origin: right;
      }

      &.is-top {
        background: var(--color-month-review-accent);
      }
    }
  }

  .is-in-view .track i {
    scale: 1 1;
  }

  @media (prefers-reduced-motion: reduce) {
    .track i {
      scale: 1 1;
      transition: none;
    }
  }
</style>
