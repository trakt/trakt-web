<script lang="ts">
  import { trackVisibleChips } from "./trackVisibleChips.ts";

  const { chips }: { chips: string[] } = $props();

  let visibleCount = $state(Infinity);
</script>

<div
  class="trakt-smart-list-template-chips"
  use:trackVisibleChips={(count) => (visibleCount = count)}
>
  {#each chips as chip, index (index)}
    <span
      class="template-chip ellipsis"
      class:is-showcase={index === 0}
      class:is-overflow={index >= visibleCount}
      data-chip
    >
      {chip}
    </span>
  {/each}

  {#if visibleCount < chips.length}
    <span class="template-chip">+{chips.length - visibleCount}</span>
  {/if}
</div>

<style lang="scss">
  .trakt-smart-list-template-chips {
    position: relative;

    display: flex;
    flex-wrap: wrap;
    gap: var(--ni-4);

    min-width: 0;
    max-height: var(--ni-44);
    overflow: hidden;
  }

  .template-chip {
    flex: 0 1 auto;

    box-sizing: border-box;
    max-width: 100%;
    height: var(--ni-20);
    padding-inline: var(--ni-8);

    border-radius: var(--border-radius-pill);
    background-color: color-mix(
      in srgb,
      var(--color-foreground) 8%,
      transparent
    );

    color: var(--color-text-secondary);
    font-size: var(--font-size-text-small);
    font-weight: 500;
    line-height: var(--ni-20);
    white-space: nowrap;

    &.is-showcase {
      background-color: var(--color-filter-chip-background);
      color: var(--color-text-emphasis);
    }

    &.is-overflow {
      position: absolute;
      visibility: hidden;
      pointer-events: none;
    }
  }
</style>
