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

<style>
  .trakt-action-button {
    --color-background-button-outline: color-mix(
      in srgb,
      var(--color-background-action-button) 10%,
      var(--color-foreground) 90%
    );

    &[data-color="purple"] {
      --color-background-purple: var(--purple-600);
      --color-foreground-purple: var(--purple-50);

      &[data-variant="primary"] {
        --color-background-action-button: var(--color-background-purple);
        --color-foreground-action-button: var(--color-foreground-purple);
        &:hover,
        &:focus-visible {
          --color-background-action-button: var(--purple-500);
        }
      }

      &[data-variant="secondary"] {
        --color-background-action-button: var(--color-foreground-purple);
        --color-foreground-action-button: var(--color-background-purple);

        &:hover,
        &:focus-visible {
          --color-background-action-button: var(--purple-100);
        }
      }
    }

    &[data-color="red"] {
      --color-background-red: var(--red-700);
      --color-foreground-red: var(--red-50);

      &[data-variant="primary"] {
        --color-background-action-button: var(--color-background-red);
        --color-foreground-action-button: var(--color-foreground-red);
        &:hover,
        &:focus-visible {
          --color-background-action-button: var(--red-600);
        }
      }

      &[data-variant="secondary"] {
        --color-background-action-button: var(--color-foreground-red);
        --color-foreground-action-button: var(--color-background-red);

        &:hover,
        &:focus-visible {
          --color-background-action-button: var(--red-100);
        }
      }
    }

    &[data-color="blue"] {
      --color-background-blue: var(--blue-700);
      --color-foreground-blue: var(--blue-50);

      &[data-variant="primary"] {
        --color-background-action-button: var(--color-background-blue);
        --color-foreground-action-button: var(--color-foreground-blue);
        &:hover,
        &:focus-visible {
          --color-background-action-button: var(--blue-500);
        }
      }

      &[data-variant="secondary"] {
        --color-background-action-button: var(--color-foreground-blue);
        --color-foreground-action-button: var(--color-background-blue);

        &:hover,
        &:focus-visible {
          --color-background-action-button: var(--blue-100);
        }
      }
    }

    &[data-color="default"] {
      --color-background-default: var(--shade-800);
      --color-foreground-default: var(--shade-50);

      &[data-variant="primary"] {
        --color-background-action-button: var(--color-background-default);
        --color-foreground-action-button: var(--color-foreground-default);
        &:hover,
        &:focus-visible {
          --color-background-action-button: var(--shade-500);
        }
      }

      &[data-variant="secondary"] {
        --color-background-action-button: var(--color-foreground-default);
        --color-foreground-action-button: var(--color-background-default);

        &:hover,
        &:focus-visible {
          --color-background-action-button: var(--shade-200);
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

    &:focus-visible {
      outline: var(--border-thickness-xs) solid
        var(--color-background-button-outline);
    }

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
