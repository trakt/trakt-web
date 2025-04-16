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
      :global(.trakt-card-cover) {
        box-shadow:
          0px var(--ni-16) var(--ni-8) 0px
            color-mix(in srgb, var(--color-shadow) 2%, transparent),
          0px var(--ni-8) var(--ni-4) 0px
            color-mix(in srgb, var(--color-shadow) 4%, transparent),
          0px var(--ni-4) var(--ni-4) 0px
            color-mix(in srgb, var(--color-shadow) 8%, transparent),
          0px var(--ni-1) var(--ni-2) 0px
            color-mix(in srgb, var(--color-shadow) 8%, transparent);
      }

      :global(.trakt-tag) {
        box-shadow: var(--ni-1) var(--ni-1) var(--ni-4) 0px
          color-mix(in srgb, var(--color-shadow) 25%, transparent);
      }

      :global(.trakt-action-button svg) {
        filter: drop-shadow(
          var(--ni-2) var(--ni-2) var(--ni-2)
            color-mix(in srgb, var(--color-shadow) 25%, transparent)
        );
      }

      :global(.trakt-card-title, .trakt-card-subtitle) {
        text-shadow: 0 var(--ni-1) var(--ni-2)
          color-mix(in srgb, var(--color-shadow) 10%, transparent);
      }
    }

    &:not(.trakt-card-transparent) {
      background: var(--color-card-background);
      box-shadow: var(--ni-0) var(--ni-8) var(--ni-8) var(--ni-0)
        color-mix(in srgb, var(--color-shadow) 25%, transparent 75%);
    }
  }
</style>
