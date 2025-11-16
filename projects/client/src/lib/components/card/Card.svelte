<script lang="ts">
  import { DpadNavigationType } from "$lib/features/navigation/models/DpadNavigationType";
  import { useNavigation } from "$lib/features/navigation/useNavigation";
  import { appendClassList } from "$lib/utils/actions/appendClassList";
  import { whenInViewport } from "$lib/utils/actions/whenInViewport";
  import { writable } from "svelte/store";
  import { dPadTrigger } from "./_internal/dPadTrigger";

  const {
    children,
    variant = "opaque",
    classList = "",
  }: ChildrenProps & {
    variant?: "transparent" | "opaque";
    classList?: string;
  } = $props();

  const isVisible = writable(false);
  const { navigation } = useNavigation();
</script>

<div
  use:whenInViewport={() => isVisible.set(true)}
  use:dPadTrigger={".trakt-card-content .trakt-link, .trakt-button-link"}
  class="trakt-card"
  data-navigation-type={$navigation}
  data-dpad-navigation={DpadNavigationType.Item}
  use:appendClassList={classList}
>
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
    all: unset;

    contain: content;
    content-visibility: auto;

    position: relative;

    contain-intrinsic-width: var(--width-override-card, var(--width-card));
    min-width: var(--width-override-card, var(--width-card));
    contain-intrinsic-height: var(--height-override-card, var(--height-card));
    min-height: var(--height-override-card, var(--height-card));
  }

  .trakt-card[data-navigation-type="dpad"] {
    &:has(:global(.trakt-link)),
    &:has(:global(.trakt-button-link)) {
      .trakt-card-content {
        transform: scale(0.95);
        /* To compensate that we're scaling a non 1:1 aspect ratio element */
        padding-top: var(--ni-1);
        box-sizing: border-box;
      }

      &:focus-visible {
        &::after {
          content: "";

          position: absolute;
          top: 0;
          left: 0;

          width: var(--width-override-card, var(--width-card));
          height: var(--height-override-card, var(--height-card));

          outline: var(--border-thickness-xs) solid var(--color-link-active);
          outline-offset: calc(-1 * var(--border-thickness-xs));

          border-radius: var(--border-radius-l);
        }
      }
    }
  }

  .trakt-card-content {
    position: relative;

    width: var(--width-override-card, var(--width-card));
    height: var(--height-override-card, var(--height-card));

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

      :global(.trakt-card-title),
      :global(.trakt-card-subtitle) {
        text-shadow: 0 var(--ni-1) var(--ni-2)
          color-mix(in srgb, var(--color-shadow) 10%, transparent);
      }
    }

    &:not(.trakt-card-transparent) {
      background: var(--color-card-background);
      box-shadow: var(--ni-0) var(--ni-8) var(--ni-8) var(--ni-0)
        color-mix(in srgb, var(--color-shadow) 25%, transparent);
    }
  }
</style>
