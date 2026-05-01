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
  class="yir-section-header"
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

  .yir-section-header {
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
      border: var(--border-thickness-xxs) solid var(--shade-10);
      background-color: color-mix(in srgb, var(--shade-1000) 50%, transparent);
      font-size: 16px;
      line-height: 1;
      text-align: center;
      margin: 0;
    }

    .yir-header-number {
      display: inline-block;
      background-color: var(--shade-10);
      color: var(--shade-1000);
      padding: var(--ni-6) var(--ni-8);
      margin-right: var(--ni-neg-4);
    }

    .yir-hash {
      font-size: 14px;
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
