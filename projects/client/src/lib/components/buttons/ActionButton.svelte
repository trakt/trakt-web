<script lang="ts">
  import { page } from "$app/stores";
  import { disableTransitionOn } from "../../utils/actions/disableTransitionOn";

  type TraktActionButtonProps = ButtonProps & {
    variant?: "purple" | "red" | "blue" | "default";
  };

  type TraktActionButtonAnchorProps = HTMLAnchorProps & TraktActionButtonProps;

  const {
    children,
    label,
    variant = "default",
    ...props
  }: TraktActionButtonProps | TraktActionButtonAnchorProps = $props();

  const href = $derived((props as TraktActionButtonAnchorProps).href);
</script>

{#if href != null}
  <a
    use:disableTransitionOn={"touch"}
    class="trakt-action-button trakt-button-link"
    class:trakt-link-active={$page.url.pathname === href}
    aria-label={label}
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

    &[data-variant="purple"] {
      --color-background-action-button: var(--purple-700);
      --color-foreground-action-button: var(--shade-50);

      &:hover,
      &:focus-visible {
        --color-background-action-button: var(--purple-500);
      }
    }

    &[data-variant="red"] {
      --color-background-action-button: var(--red-700);
      --color-foreground-action-button: var(--shade-50);

      &:hover,
      &:focus-visible {
        --color-background-action-button: var(--red-600);
      }
    }

    &[data-variant="blue"] {
      --color-background-action-button: var(--blue-700);
      --color-foreground-action-button: var(--shade-50);

      &:hover,
      &:focus-visible {
        --color-background-action-button: var(--blue-500);
      }
    }

    &[data-variant="default"] {
      --color-background-action-button: var(--shade-800);
      --color-foreground-action-button: var(--shade-50);

      &:hover,
      &:focus-visible {
        --color-background-action-button: var(--shade-500);
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

    border-radius: var(--ni-12);

    transition: background-color var(--transition-increment) ease-in-out;

    &:focus-visible {
      outline: var(--ni-2) solid var(--color-background-button-outline);
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
