<script lang="ts">
  import { DpadNavigationType } from "$lib/features/navigation/models/DpadNavigationType";
  import type { Snippet } from "svelte";

  const {
    children,
    icon,
    isPressed,
    onclick,
    variant = "icon",
    label,
  }: {
    icon: Snippet;
    isPressed: boolean;
    onclick: () => void;
    variant?: "icon" | "text";
    label: string;
  } & ChildrenProps = $props();
</script>

<button
  class="trakt-toggler-toggle"
  class:is-pressed={isPressed}
  class:text-variant={variant === "text"}
  data-dpad-navigation={DpadNavigationType.Item}
  aria-label={label}
  {onclick}
>
  {@render icon()}
  {#if variant === "text"}
    <p class="meta-info ellipsis">{@render children()}</p>
  {/if}
</button>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-toggler-toggle {
    all: unset;

    -webkit-tap-highlight-color: transparent;

    --toggle-height: var(--ni-30);
    --toggle-width: var(--toggle-height);

    height: var(--toggle-height);
    width: var(--toggle-width);
    box-sizing: border-box;

    display: flex;
    align-items: center;
    justify-content: flex-start;
    overflow: hidden;

    gap: var(--gap-xs);
    padding: var(--ni-8);

    border-radius: var(--border-radius-xxl);

    color: var(--toggle-foreground-color);
    background-color: var(--toggle-background-color);

    transition: width var(--toggle-animation-duration) ease-in-out;
    transition-delay: var(--toggle-animation-delay);

    &:not(.is-pressed) {
      cursor: pointer;

      @include for-mouse {
        &:hover {
          --toggle-background-color: var(--toggle-background-hover-color);
        }
      }
    }

    :global(svg),
    :global(img) {
      z-index: var(--layer-raised);

      flex-shrink: 0;
      width: var(--ni-18);
      height: var(--ni-18);
    }

    :global(img) {
      border-radius: 50%;
    }

    @include for-mouse {
      &:focus-visible {
        outline: var(--ni-2) solid var(--toggle-foreground-color);
        outline-offset: var(--ni-2);
      }
    }
  }

  .trakt-toggler-toggle.text-variant {
    --toggle-width: var(--toggle-large-width);

    p {
      z-index: var(--layer-raised);
      flex-grow: 1;
      text-align: center;

      transition: opacity var(--toggle-animation-duration) ease-in-out;
      transition-delay: var(--toggle-animation-delay);
    }

    &:not(.is-pressed) {
      --toggle-width: var(--toggle-height);

      p {
        opacity: 0;
      }
    }
  }

  .trakt-toggler-toggle:active {
    :global(.icon-active) {
      opacity: 0;
    }

    :global(.icon-inactive) {
      opacity: 1;
    }
  }
</style>
