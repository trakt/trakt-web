<script lang="ts">
  import { appendGlobalParameters } from "$lib/features/parameters/appendGlobalParameters";
  import { useActiveLink } from "$lib/stores/useActiveLink";
  import { clickOutside } from "$lib/utils/actions/clickOutside";
  import { disableNavigation } from "$lib/utils/actions/disableNavigation";
  import { disableTransitionOn } from "$lib/utils/actions/disableTransitionOn";
  import { triggerWithKeyboard } from "$lib/utils/actions/triggerWithKeyboard";
  import { onMount } from "svelte";
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
    navigationType,
    disabled,
    "data-testid": dataTestId,
    ...props
  }: TraktButtonProps | TraktButtonAnchorProps = $props();

  const rest = $derived({
    ...props,
    disabled: disabled || undefined,
  });

  const hasIcon = $state(icon != null);
  const isDefaultAlignment = $derived(hasIcon);
  const alignment = $derived(isDefaultAlignment ? "default" : "centered");
  const href = $derived((rest as TraktButtonAnchorProps).href);
  const noscroll = $derived((rest as TraktButtonAnchorProps).noscroll);
  const { isActive } = $derived(useActiveLink(href));

  const appendTestId = $derived((element: HTMLElement) => {
    onMount(() => {
      if (!dataTestId) return;
      element.setAttribute("data-testid", dataTestId);
    });
  });
</script>

{#snippet contents()}
  <div class="button-label">
    <p
      class="ellipsis"
      class:small={subtitle != null || style === "underlined"}
      class:bold={style === "underlined"}
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
    use:appendGlobalParameters
    use:disableNavigation={rest.disabled}
    use:appendTestId
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
    data-dpad-navigation={navigationType}
    {...rest}
  >
    {@render contents()}
  </a>
{:else}
  <button
    use:disableTransitionOn={"touch"}
    use:clickOutside
    use:appendTestId
    class="trakt-button"
    aria-label={label}
    data-variant={variant}
    data-alignment={alignment}
    data-style={style}
    data-color={color}
    data-size={size}
    data-dpad-navigation={navigationType}
    {...rest}
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

    --color-highlight: rgba(255, 255, 255, 0.52);
    --color-shadow: rgba(0, 0, 0, 0.32);

    all: unset;
    display: flex;
    align-items: center;
    gap: var(--gap-m);
    min-width: var(--ni-40);
    padding: var(--ni-16);
    flex-shrink: 0;
    cursor: pointer;
    user-select: none;
    -webkit-tap-highlight-color: transparent;

    background: var(--color-background-button);
    color: var(--color-foreground-button);

    position: relative;
    overflow: hidden;

    transition: var(--transition-increment) ease-in-out;
    transition-property:
      box-shadow, outline, padding, transform, color, background,
      text-decoration;

    &:not([data-style="underlined"]) p:not(.meta-info) {
      font-size: 1rem;
      font-style: normal;
      font-weight: 700;
    }

    p:not(.meta-info) {
      text-transform: uppercase;
    }

    &.trakt-button-link {
      &[data-style="ghost"] {
        &.trakt-link-active {
          color: var(--color-background-button);
        }
      }

      &[data-style="underlined"] {
        &.trakt-link-active {
          text-decoration-color: color-mix(
            in srgb,
            var(--color-background-button) 80%,
            white 20%
          );
          text-decoration-line: underline;
        }
      }
    }

    @each $color in "purple", "red", "blue", "orange", "default", "custom" {
      @include color-styles($color);
    }

    &[data-alignment="default"] {
      justify-content: space-between;
    }

    &[data-alignment="centered"] {
      justify-content: center;
    }

    &[data-size="small"],
    &[data-size="tag"] {
      // TODO: revert this once the dynamic scaling is figured out

      .button-label {
        p:not(.meta-info) {
          font-size: 0.75rem;
          font-weight: 600;
        }

        p.meta-info {
          font-size: var(--ni-8);
          font-weight: 400;
        }
      }

      .button-icon {
        :global(svg) {
          width: auto;
          height: var(--ni-18);
        }
      }
    }

    &[data-size="small"] {
      --button-height: var(--ni-40);
      border-radius: calc(var(--border-radius-m) * 0.76925);
      padding: var(--ni-12);
      gap: var(--ni-12);
    }

    &[data-size="tag"] {
      --button-height: var(--ni-18);
      padding: var(--ni-2) var(--ni-10);
      min-width: var(--ni-48);
      box-sizing: border-box;

      &[data-style="ghost"] {
        margin: 0;
      }
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
      align-items: center;
      gap: var(--gap-xs);
    }

    .button-label {
      // Needed to make ellipses work with flex
      // https://css-tricks.com/flexbox-truncated-text/
      min-width: 0;
    }

    p,
    .button-label,
    .button-icon {
      z-index: var(--layer-base);
    }

    &::before {
      content: "";

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
      margin: var(--ni-neg-4) var(--ni-neg-10);
      transform: scale(calc(var(--scale-factor-button) * 0.76925));
      background: transparent;
      /** This is required for improved readability when rendering over a cover image */
      backdrop-filter: blur(var(--ni-16));

      &:not([data-variant="secondary"]) {
        color: var(--color-foreground);
      }

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
            background: var(--color-background-button);
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
        transform: scale(calc(var(--scale-factor-button) * 0.7));
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

    &[data-style="underlined"] {
      --underline-offset: var(--ni-4);
      --line-thickness: var(--ni-2);

      background: transparent;
      text-decoration-color: transparent;
      color: var(--color-foreground);

      text-underline-offset: var(--underline-offset);
      text-decoration-thickness: var(--line-thickness);
      line-height: calc(100% + var(--underline-offset) + var(--line-thickness));

      &[disabled] {
        color: var(--color-foreground-button-disabled);
      }

      @include for-mouse {
        &:hover:not([disabled]) {
          text-decoration-line: underline;
          text-decoration-color: var(--color-foreground);

          &:not(.trakt-link-active) {
            color: color-mix(
              in srgb,
              var(--color-foreground-button) 80%,
              white 20%
            );
          }
        }
      }
    }
  }
</style>
