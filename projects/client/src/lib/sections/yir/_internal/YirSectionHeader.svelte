<script lang="ts">
  import type { Snippet } from "svelte";

  const {
    children,
    rank,
    compact = false,
    noTopPadding = false,
    flat = false,
  }: {
    children: Snippet;
    rank?: number;
    compact?: boolean;
    noTopPadding?: boolean;
    flat?: boolean;
  } = $props();
</script>

<div
  class="trakt-yir-section-header"
  class:compact
  class:no-top-padding={noTopPadding}
  class:flat
>
  <h2>
    {#if rank !== undefined}
      <span class="yir-header-number">
        <span class="yir-hash">#</span>{rank}
      </span>
    {/if}
    <span class="yir-header-text">
      {@render children()}
    </span>
  </h2>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-yir-section-header {
    text-align: center;
    padding: var(--ni-72) 0;

    &.compact {
      padding-bottom: var(--ni-20);
    }

    &.no-top-padding {
      padding-top: 0;
    }

    &.flat {
      padding: 0;
    }

    h2 {
      text-transform: uppercase;
      display: inline-block;
      letter-spacing: 1px;
      border: var(--border-thickness-xxs) solid var(--color-yir-border);
      background-color: var(--color-yir-title-chip-background);
      font-size: var(--ni-16);
      line-height: 1;
      text-align: center;
      margin: 0;
    }

    .yir-header-number {
      display: inline-block;
      background-color: var(--color-yir-badge-background);
      color: var(--color-yir-badge-foreground);
      padding: var(--ni-6) var(--ni-8);
      margin-inline-end: var(--ni-neg-4);
    }

    .yir-hash {
      font-size: var(--font-size-text);
    }

    .yir-header-text {
      display: inline-block;
      padding: var(--ni-6) var(--ni-8);
    }

    @include for-mobile {
      padding: var(--ni-40) 0;

      &.compact {
        padding-bottom: var(--ni-16);
      }

      &.no-top-padding {
        padding-top: 0;
      }

      &.flat {
        padding: 0;
      }
    }
  }
</style>
