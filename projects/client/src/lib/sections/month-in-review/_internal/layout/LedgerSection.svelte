<script lang="ts">
  import { whenInViewport } from "$lib/utils/actions/whenInViewport";
  import type { Snippet } from "svelte";
  import { REVEAL_MARGIN } from "../parts/REVEAL_MARGIN.ts";

  const {
    label,
    count,
    trailing,
    children,
  }: {
    label: string;
    count?: string;
    trailing?: Snippet;
    children: Snippet;
  } = $props();

  let isInView = $state(false);
</script>

<section
  class="trakt-month-review-section"
  class:is-in-view={isInView}
  use:whenInViewport={{
    callback: () => (isInView = true),
    rootMargin: REVEAL_MARGIN,
  }}
>
  <header class="head">
    <h2 class="label">
      {label}
      {#if count}<span class="count">{count}</span>{/if}
    </h2>
    {@render trailing?.()}
  </header>
  {@render children()}
</section>

<style lang="scss">
  .trakt-month-review-section {
    display: flex;
    flex-direction: column;
    gap: var(--gap-m);
    opacity: 0;
    transition: opacity 600ms ease-out;

    > :global(:not(.head)) {
      translate: 0 var(--ni-24);
      transition: translate 700ms cubic-bezier(0.16, 1, 0.3, 1);
    }

    &.is-in-view {
      opacity: 1;

      > :global(:not(.head)) {
        translate: none;
      }
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .trakt-month-review-section,
    .trakt-month-review-section > :global(:not(.head)) {
      opacity: 1;
      translate: none;
      transition: none;
    }
  }

  .head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--gap-s);
    padding-top: var(--gap-m);
    border-top: 1px solid var(--color-month-review-hairline);
  }

  .label {
    margin: 0;
    font-size: var(--font-size-text-small);
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  .count {
    margin-inline-start: var(--gap-xs);
    font-size: inherit;
    font-weight: inherit;
    color: var(--color-text-secondary);
  }
</style>
