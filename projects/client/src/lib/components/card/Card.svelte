<script lang="ts">
  import { whenInViewport } from "$lib/utils/actions/whenInViewport";
  import { writable } from "svelte/store";

  const {
    children,
    variant = "opaque",
  }: ChildrenProps & { variant?: "transparent" | "opaque" } = $props();

  const isVisible = writable(false);
</script>

<div use:whenInViewport={() => isVisible.set(true)} class="trakt-card">
  <div
    class="trakt-card-content"
    class:trakt-card-transparent={variant === "transparent"}
  >
    {#if $isVisible}
      {@render children()}
    {/if}
  </div>
</div>

<style>
  .trakt-card {
    position: relative;

    min-width: var(--width-card);
    min-height: var(--height-card);
  }

  .trakt-card-content {
    width: var(--width-card);
    height: var(--height-card);

    border-radius: var(--border-radius-m);

    &.trakt-card-transparent {
      :global(.card-cover) {
        box-shadow: var(--ni-0) var(--ni-8) var(--ni-8) var(--ni-0)
          color-mix(in srgb, var(--color-shadow) 25%, transparent 75%);

        box-shadow:
          0px 15px 6px 0px
            color-mix(in srgb, var(--color-shadow) 2%, transparent),
          0px 9px 5px 0px
            color-mix(in srgb, var(--color-shadow) 4%, transparent),
          0px 4px 4px 0px
            color-mix(in srgb, var(--color-shadow) 8%, transparent),
          0px 1px 2px 0px
            color-mix(in srgb, var(--color-shadow) 8%, transparent);
      }
    }

    &:not(.trakt-card-transparent) {
      background: var(--color-card-background);
      box-shadow: var(--ni-0) var(--ni-8) var(--ni-8) var(--ni-0)
        color-mix(in srgb, var(--color-shadow) 25%, transparent 75%);
    }
  }
</style>
