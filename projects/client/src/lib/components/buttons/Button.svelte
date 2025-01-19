<script lang="ts">
  import { useActiveLink } from "$lib/stores/useActiveLink";
  import { clickOutside } from "$lib/utils/actions/clickOutside";
  import { disableTransitionOn } from "$lib/utils/actions/disableTransitionOn";
  import { triggerWithKeyboard } from "$lib/utils/actions/triggerWithKeyboard";
  import { triggerWithTouch } from "$lib/utils/actions/triggerWithTouch";
  import type { TraktButtonProps } from "./TraktButtonProps";

  type TraktButtonAnchorProps = HTMLAnchorProps &
    TraktButtonProps & { onclickoutside?: (ev: CustomEvent) => void };

  const {
    label,
    children,
    variant = "primary",
    style = "flat",
    color = "custom",
    icon,
    subtitle,
    size = "normal",
    text = "uppercase",
    ...props
  }: TraktButtonProps | TraktButtonAnchorProps = $props();

  const hasIcon = $state(icon != null);
  const isDefaultAlignment = $derived(hasIcon);
  const alignment = $derived(isDefaultAlignment ? "default" : "centered");
  const href = $derived((props as TraktButtonAnchorProps).href);
  const noscroll = $derived((props as TraktButtonAnchorProps).noscroll);
  const { isActive } = $derived(useActiveLink(href));
</script>

{#snippet contents()}
  <div class="button-label">
    <p
      class="ellipsis"
      class:small={subtitle != null}
      class:capitalize={text === "capitalize"}
    >
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
{/snippet}

{#if href != null}
  <a
    use:disableTransitionOn={"touch"}
    use:clickOutside
    use:triggerWithKeyboard
    use:triggerWithTouch
    data-sveltekit-keepfocus
    data-sveltekit-noscroll={noscroll}
    class="trakt-button trakt-button-link"
    class:trakt-link-active={$isActive}
    aria-label={label}
    data-variant={variant}
    data-alignment={alignment}
    data-style={style}
    data-color={color}
    data-size={size}
    {...props}
  >
    {@render contents()}
  </a>
{:else}
  <button
    use:disableTransitionOn={"touch"}
    use:clickOutside
    class="trakt-button"
    aria-label={label}
    data-variant={variant}
    data-alignment={alignment}
    data-style={style}
    data-color={color}
    data-size={size}
    {...props}
  >
    {@render contents()}
  </button>
{/if}

<style lang="scss">
  @use "$style/scss/mixins/index.scss" as *;

  @mixin variant-styles($variant, $background-color, $foreground-color) {
    &[data-variant="#{$variant}"] {
      --color-background-button: #{$background-color};
      --color-foreground-button: #{$foreground-color};

      &:not([data-style="textured"]):not([data-style="ghost"]) {
        @include for-mouse {
          &:hover,
          &:focus-visible {
            --color-foreground-button: #{$background-color};
            --color-background-button: #{$foreground-color};
          }
        }
      }
    }
  }

  @mixin color-styles($color) {
    &[data-color="#{$color}"] {
      $background-color: var(--color-background-#{$color});
      $foreground-color: var(--color-foreground-#{$color});

      @include variant-styles("primary", $background-color, $foreground-color);
      @include variant-styles(
        "secondary",
        $foreground-color,
        $background-color
      );

      @include for-mouse {
        &:focus-visible {
          outline: var(--border-thickness-xs) solid
            var(--color-foreground-button);
        }
      }
    }
  }

  .trakt-button {
    --color-background-button-outline: color-mix(
      in srgb,
      var(--color-background-button) 10%,
      var(--color-foreground) 90%
    );

    --scale-factor-button: 1;
    --button-height: var(--ni-52);

    --color-background-button-light: color-mix(
      in srgb,
      var(--color-background-button) 35%,
      white 65%
    );

    --color-highlight: color-mix(in srgb, white 52%, transparent 48%);
    --color-shadow: color-mix(in srgb, black 32%, transparent 68%);

    all: unset;
    display: flex;
    align-items: center;
    gap: var(--ni-16);
    min-width: var(--ni-96);
    padding: var(--ni-16);
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

    &.trakt-button-link {
      &[data-style="ghost"] {
        &.trakt-link-active {
          color: var(--color-background-button);
        }
      }
    }

    @each $color in "purple", "red", "blue", "default", "custom" {
      @include color-styles($color);
    }

    &[data-alignment="default"] {
      justify-content: space-between;
    }

    &[data-alignment="centered"] {
      justify-content: center;
    }

    &[data-size="small"] {
      --scale-factor-button: 0.75;
      margin: var(--ni-neg-2) var(--ni-neg-8);
    }

    &[data-size="tag"] {
      --scale-factor-button: 0.75;
      --button-height: var(--ni-24);
      padding: var(--ni-4) var(--ni-10);
    }

    &,
    &::before,
    &:active[disabled] {
      height: var(--button-height);
      box-sizing: border-box;
      border-radius: var(--border-radius-m);
    }

    &::before {
      width: 100%;
    }

    .button-icon {
      display: flex;
      gap: var(--ni-8);
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

    @include for-mouse {
      &:hover::before,
      &:focus-visible::before {
        opacity: 1;
      }
    }

    &:active::before {
      opacity: 0;
    }

    &:active[disabled] {
      animation: jiggle-wiggle var(--animation-duration-jiggle-wiggle) infinite;
    }

    &:focus-visible {
      outline: var(--border-thickness-xs) solid
        var(--color-background-button-outline);
    }

    &[disabled] {
      cursor: not-allowed;
      color: var(--color-foreground-button-disabled);
      background: var(--color-surface-button-disabled);

      &::before {
        display: none;
      }
    }

    &[data-style="ghost"] {
      margin: var(--ni-neg-2) var(--ni-neg-6);
      transform: scale(calc(var(--scale-factor-button) * 0.9));
      background: transparent;
      color: color(var(--color-foreground));

      &[disabled] {
        color: var(--color-foreground-button-disabled);
      }

      @include for-mouse {
        &:hover:not([disabled]) {
          color: var(--color-foreground-button);

          &[data-size="tag"] {
            outline: var(--border-thickness-xs) solid
              var(--color-background-button);
          }

          &[data-variant="primary"] {
            background: color-mix(
              in srgb,
              var(--color-background-button) 60%,
              transparent 40%
            );
          }

          &[data-variant="secondary"] {
            background: color-mix(
              in srgb,
              var(--color-foreground-button) 10%,
              transparent 90%
            );
          }
        }
      }

      &:active:not([disabled]) {
        transform: scale(calc(var(--scale-factor-button) * 0.87));
      }

      &[data-size="tag"] {
        outline: var(--border-thickness-xxs) solid var(--color-foreground);
      }
    }

    &[data-style="textured"] {
      &:not([data-size="tag"]) {
        padding-top: var(--ni-12);
      }

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
      &:active:not([disabled]) {
        transform: scale(calc(var(--scale-factor-button) * 0.97));
      }
    }
  }
</style>
