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
    style = "default",
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
    data-style={style}
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
    data-style={style}
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

    &[data-style="purple"] {
      --background-style-purple: var(--purple-700);
      --foreground-style-purple: var(--purple-50);

      &[data-variant="primary"] {
        --color-background-action-button: var(--background-style-purple);
        --color-foreground-action-button: var(--foreground-style-purple);
        &:hover,
        &:focus-visible {
          --color-background-action-button: var(--purple-500);
        }
      }

      &[data-variant="secondary"] {
        --color-background-action-button: var(--foreground-style-purple);
        --color-foreground-action-button: var(--background-style-purple);

        &:hover,
        &:focus-visible {
          --color-background-action-button: var(--purple-100);
        }
      }
    }

    &[data-style="red"] {
      --background-style-red: var(--red-700);
      --foreground-style-red: var(--red-50);

      &[data-variant="primary"] {
        --color-background-action-button: var(--background-style-red);
        --color-foreground-action-button: var(--foreground-style-red);
        &:hover,
        &:focus-visible {
          --color-background-action-button: var(--red-600);
        }
      }

      &[data-variant="secondary"] {
        --color-background-action-button: var(--foreground-style-red);
        --color-foreground-action-button: var(--background-style-red);

        &:hover,
        &:focus-visible {
          --color-background-action-button: var(--red-100);
        }
      }
    }

    &[data-style="blue"] {
      --background-style-blue: var(--blue-700);
      --foreground-style-blue: var(--blue-50);

      &[data-variant="primary"] {
        --color-background-action-button: var(--background-style-blue);
        --color-foreground-action-button: var(--foreground-style-blue);
        &:hover,
        &:focus-visible {
          --color-background-action-button: var(--blue-500);
        }
      }

      &[data-variant="secondary"] {
        --color-background-action-button: var(--foreground-style-blue);
        --color-foreground-action-button: var(--background-style-blue);

        &:hover,
        &:focus-visible {
          --color-background-action-button: var(--blue-100);
        }
      }
    }

    &[data-style="default"] {
      --background-style-default: var(--shade-800);
      --foreground-style-default: var(--shade-50);

      &[data-variant="primary"] {
        --color-background-action-button: var(--background-style-default);
        --color-foreground-action-button: var(--foreground-style-default);
        &:hover,
        &:focus-visible {
          --color-background-action-button: var(--shade-500);
        }
      }

      &[data-variant="secondary"] {
        --color-background-action-button: var(--foreground-style-default);
        --color-foreground-action-button: var(--background-style-default);

        &:hover,
        &:focus-visible {
          --color-background-action-button: var(--shade-100);
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
