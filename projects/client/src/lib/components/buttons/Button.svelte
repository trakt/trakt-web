<script lang="ts">
  import type { Snippet } from "svelte";
  import { disableTransitionOn } from "../../utils/actions/disableTransitionOn";

  type TraktButtonProps = ButtonProps & {
    variant?: "primary" | "secondary" | "vip" | "custom";
    style?: "textured" | "flat" | "ghost";
    icon?: Snippet;
    subtitle?: Snippet;
    size?: "normal" | "small";
    text?: "capitalize" | "uppercase";
  };

  const {
    label,
    children,
    variant = "primary",
    style = "flat",
    icon,
    subtitle,
    size = "normal",
    text = "uppercase",
    ...props
  }: TraktButtonProps = $props();

  const hasIcon = $state(icon != null);
  const isDefaultAlignment = $derived(hasIcon);
  const alignment = $derived(isDefaultAlignment ? "default" : "centered");
</script>

<button
  use:disableTransitionOn={"touch"}
  class="trakt-button"
  {...props}
  aria-label={label}
  data-variant={variant}
  data-alignment={alignment}
  data-style={style}
  data-size={size}
>
  <div class="button-label">
    <p class:small={subtitle != null} class:capitalize={text === "capitalize"}>
      {@render children()}
    </p>
    {#if subtitle != null}
      <p class="button-subtitle meta-info">{@render subtitle()}</p>
    {/if}
  </div>
  {#if icon}
    <div class="button-icon">
      {@render icon()}
    </div>
  {/if}
</button>

<style>
  .trakt-button {
    --color-background-button-outline: color-mix(
      in srgb,
      var(--color-background-button) 10%,
      var(--color-foreground) 90%
    );

    --scale-factor-button: 1;

    --color-background-button-light: color-mix(
      in srgb,
      var(--color-background-button) 35%,
      white 65%
    );

    --color-background-button-disabled-default: color-mix(
      in srgb,
      var(--color-background-button) 10%,
      grey 90%
    );

    --color-highlight: color-mix(in srgb, white 52%, transparent 48%);
    --color-shadow: color-mix(in srgb, black 32%, transparent 68%);

    &[data-variant="primary"] {
      --color-background-button: var(--color-surface-button-primary);
      --color-foreground-button: var(--color-foreground-button-primary);
      --color-background-button-disabled: var(--color-surface-button-disabled);
    }

    &[data-variant="vip"] {
      --color-background-button: var(--color-surface-button-vip);
      --color-foreground-button: var(--color-foreground-button-vip);
      --color-background-button-disabled: var(--color-surface-button-disabled);
    }

    &[data-variant="secondary"] {
      --color-background-button: var(--color-surface-button-secondary);
      --color-foreground-button: var(--color-foreground-button-secondary);
      --color-background-button-outline: var(--color-border-button-secondary);
      --color-background-button-disabled: var(--color-surface-button-disabled);
    }

    &[data-alignment="default"] {
      justify-content: space-between;
    }

    &[data-alignment="centered"] {
      justify-content: center;
    }

    all: unset;

    display: flex;
    align-items: center;
    gap: var(--ni-16);
    flex-shrink: 0;
    cursor: pointer;
    user-select: none;
    -webkit-tap-highlight-color: transparent;

    background: var(--color-background-button);
    color: var(--color-foreground-button);

    position: relative;
    overflow: hidden;

    transform: scale(var(--scale-factor-button));

    transition: var(--transition-increment) ease-in-out;
    transition-property: box-shadow outline padding transform color background;

    &[data-size="small"] {
      --scale-factor-button: 0.75;
    }

    & {
      min-width: var(--ni-96);
    }

    &,
    &::before,
    &:active[disabled] {
      height: var(--ni-52);
      box-sizing: border-box;
      border-radius: var(--ni-12);
    }

    &::before {
      width: 100%;
    }

    .button-icon {
      display: flex;
    }

    p,
    .button-label,
    .button-icon {
      z-index: 1;
    }

    &::before {
      content: "";
      z-index: 0;

      position: absolute;
      top: 0;
      left: 0;

      opacity: 0;
      transition: opacity var(--transition-increment) ease-in-out;
    }

    &:hover::before,
    &:focus-visible::before {
      opacity: 1;
    }

    &:active::before {
      opacity: 0;
    }

    &:active[disabled] {
      animation: jiggle-wiggle var(--animation-duration-jiggle-wiggle) infinite;
    }

    &:focus-visible {
      outline: var(--ni-2) solid var(--color-background-button-outline);
    }

    &[disabled] {
      cursor: not-allowed;
      color: var(--color-foreground-button-disabled);
      background: var(
        --color-background-button-disabled,
        var(--color-background-button-disabled-default)
      );

      &::before {
        display: none;
      }
    }

    &[data-style="ghost"] {
      padding: var(--ni-16);
      transform: scale(calc(var(--scale-factor-button) * 0.9));
      background: transparent;
      color: inherit;

      &:hover:not([disabled]) {
        color: var(--color-foreground-button);
      }

      &[disabled] {
        color: var(--color-foreground-button-disabled);
      }

      &:hover:not([disabled]) {
        background: color-mix(
          in srgb,
          var(--color-background-button) 60%,
          transparent 40%
        );
      }

      &:active:not([disabled]) {
        transform: scale(calc(var(--scale-factor-button) * 0.87));
      }
    }

    &[data-style="textured"] {
      padding: var(--ni-16);
      padding-top: var(--ni-12);

      &,
      &::before {
        box-shadow:
          0px 1px 2px 0px var(--color-highlight) inset,
          2px -4px 2px 0px var(--color-shadow) inset,
          0px 2px 8px 0px var(--color-shadow);
      }

      &::before {
        background: radial-gradient(
          59.13% 72.55% at 50.22% 118.63%,
          var(--color-background-button-light) 0%,
          var(--color-background-button) 100%
        );
      }

      &:not([disabled]):active {
        padding-top: var(--ni-16);

        box-shadow:
          0px -1px 2px 0px var(--color-highlight) inset,
          2px 4px 2px 0px var(--color-shadow) inset,
          0px 2px 8px 0px var(--color-shadow);
      }
    }

    &[data-style="flat"] {
      padding: var(--ni-16);
      &[data-variant="primary"] {
        &:hover:not([disabled]) {
          background: var(--color-surface-button-secondary);
          color: var(--color-foreground-button-secondary);
        }
      }

      &[data-variant="secondary"] {
        &:hover:not([disabled]) {
          background: var(--color-surface-button-primary);
          color: var(--color-foreground-button-primary);
        }
      }

      &:active:not([disabled]) {
        transform: scale(calc(var(--scale-factor-button) * 0.97));
      }
    }
  }
</style>
