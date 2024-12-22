<script lang="ts">
  import { useActiveLink } from "$lib/stores/useActiveLink";
  import { disableTransitionOn } from "$lib/utils/actions/disableTransitionOn";
  import { navigateWithFocus } from "$lib/utils/actions/navigateWithFocus";
  import type { TraktActionButtonProps } from "./TraktActionButtonProps";

  type TraktActionButtonAnchorProps = HTMLAnchorProps & TraktActionButtonProps;

  const {
    children,
    label,
    variant = "primary",
    color = "default",
    ...props
  }: TraktActionButtonProps | TraktActionButtonAnchorProps = $props();

  const href = $derived((props as TraktActionButtonAnchorProps).href);
  const { isActive } = $derived(useActiveLink(href));
</script>

{#if href != null}
  <a
    use:disableTransitionOn={"touch"}
    use:navigateWithFocus
    class="trakt-action-button trakt-button-link"
    class:trakt-link-active={$isActive}
    aria-label={label}
    data-color={color}
    data-variant={variant}
    {...props}
  >
    {@render children()}
  </a>
{:else}
  <button
    use:disableTransitionOn={"touch"}
    class="trakt-action-button trakt-button-link"
    aria-label={label}
    data-color={color}
    data-variant={variant}
    {...props}
  >
    {@render children()}
  </button>
{/if}

<style lang="scss">
  .trakt-action-button {
    @each $color in "purple", "red", "blue", "default" {
      &[data-color="#{$color}"] {
        $background-color: var(--color-background-#{$color});
        $foreground-color: var(--color-foreground-#{$color});

        &[data-variant="primary"] {
          $hover: var(--color-background-#{$color}-hover);

          --color-background-action-button: #{$background-color};
          --color-foreground-action-button: #{$foreground-color};

          &:hover,
          &:focus-visible {
            --color-background-action-button: #{$foreground-color};
            --color-foreground-action-button: #{$background-color};
          }
        }

        &[data-variant="secondary"] {
          --color-background-action-button: #{$foreground-color};
          --color-foreground-action-button: #{$background-color};

          &:hover,
          &:focus-visible {
            --color-background-action-button: #{$background-color};
            --color-foreground-action-button: #{$foreground-color};
          }
        }

        &:focus-visible {
          outline: var(--border-thickness-xs)
            solid
            var(--color-foreground-action-button);
        }
      }
    }

    &[disabled] {
      cursor: not-allowed;
      color: var(--color-foreground-button-disabled);
      background: var(
        --color-background-button-disabled,
        var(--color-surface-button-disabled)
      );

      &::before {
        display: none;
      }
    }

    all: unset;

    cursor: pointer;
    user-select: none;
    -webkit-tap-highlight-color: transparent;

    display: flex;
    width: var(--ni-36);
    height: var(--ni-36);
    padding: var(--ni-6);
    justify-content: center;
    align-items: center;
    flex-shrink: 0;

    border-radius: var(--border-radius-m);

    transition: background-color var(--transition-increment) ease-in-out;

    &:active {
      transform: scale(0.95);

      &[disabled] {
        animation: jiggle-wiggle var(--animation-duration-jiggle-wiggle)
          infinite;
      }
    }

    background-color: var(--color-background-action-button);
    color: var(--color-foreground-action-button);
  }
</style>
