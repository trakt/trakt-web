<script lang="ts">
  import SwitchIcon from "../icons/SwitchIcon.svelte";
  import type { SwitchProps } from "./SwitchProps";

  const {
    label,
    innerText,
    color = "purple",
    navigationType,
    icon,
    ...props
  }: SwitchProps = $props();
</script>

<label class="trakt-switch" class:has-custom-icon={!!icon}>
  <input
    type="checkbox"
    role="switch"
    data-color={color}
    aria-label={label}
    data-dpad-navigation={navigationType}
    {...props}
  />

  <span class="trakt-switch-tick">
    {#if icon}
      {@render icon()}
    {:else}
      <SwitchIcon />
    {/if}
  </span>
  {#if innerText}
    <span class="trakt-switch-text bold ellipsis">
      {innerText}
    </span>
  {/if}
</label>

<style lang="scss">
  @use "$style/scss/mixins/index.scss" as *;

  @mixin state-styles($background-color, $foreground-color) {
    --color-foreground-switch: #{$background-color};
    --color-background-switch: #{$foreground-color};

    &:has(input:not([disabled]):checked) {
      --color-foreground-switch: #{$foreground-color};
      --color-background-switch: #{$background-color};
    }

    @include for-mouse {
      &:hover:has(input:not([disabled])) {
        --color-foreground-switch: #{$foreground-color};
        --color-background-switch: #{$background-color};

        &:has(input:checked) {
          --color-foreground-switch: #{$background-color};
          --color-background-switch: #{$foreground-color};
        }
      }
    }
  }

  @mixin color-styles($color) {
    &:has(input[data-color="#{$color}"]) {
      $foreground-color: var(--color-switch-foreground-#{$color});
      $background-color: var(--color-switch-background-#{$color});
      --color-tick: var(--color-tick-#{$color});

      &.has-custom-icon {
        $foreground-color: var(--color-switch-foreground-#{$color});
        $background-color: var(--color-tick-#{$color});
        --color-tick: var(--color-switch-foreground-#{$color});
      }

      @include state-styles($background-color, $foreground-color);
    }
  }

  @keyframes direction-preview {
    0% {
      transform: rotate(initial);
    }
    50% {
      transform: rotate(45deg);
    }
    100% {
      transform: rotate(initial);
    }
  }

  .trakt-switch {
    --button-width: var(--custom-width, var(--ni-64));
    --button-height: var(--ni-28);

    --text-width: calc(var(--button-width) - var(--ni-40));
    --text-offset: var(--ni-10);

    --tick-size: var(--ni-20);
    --tick-offset: var(--ni-4);

    all: unset;
    cursor: pointer;

    display: flex;
    position: relative;
    align-items: center;

    min-width: var(--button-width);
    max-width: var(--button-width);
    width: var(--button-width);
    height: var(--button-height);

    box-shadow: var(--ni-0) var(--ni-4) var(--ni-4) var(--ni-0)
      color-mix(in srgb, var(--color-shadow) 25%, transparent) inset;

    box-sizing: border-box;
    padding: var(--ni-4);
    border-radius: var(--border-radius-l);

    transition: var(--transition-increment) ease-in-out;
    transition-property: background-color, outline;

    -webkit-tap-highlight-color: transparent;
    background-color: var(--color-background-switch);

    @each $color in "purple", "red", "blue", "orange", "default", "custom" {
      @include color-styles($color);
    }

    &:has(input:active[disabled]) {
      animation: jiggle-wiggle var(--animation-duration-jiggle-wiggle) infinite;
    }

    &:has(input[disabled]) {
      --color-foreground-switch: var(--color-foreground-button-disabled);
      --color-background-switch: var(--color-surface-button-disabled);
      --color-tick: var(--color-foreground-button-disabled);

      cursor: not-allowed;
    }

    @include for-mouse {
      &:hover:has(input:not([disabled])) {
        .trakt-switch-tick {
          :global(svg) {
            animation: direction-preview calc(var(--transition-increment) * 2)
              ease-in;
          }
        }
      }
    }

    input {
      opacity: 0;
      width: 0;
      height: 0;
    }

    &:has(input:checked) {
      .trakt-switch-text {
        transform: translateX(0);
      }

      .trakt-switch-tick {
        transform: translateX(
          calc(var(--button-width) - var(--tick-size) - 2 * var(--tick-offset))
        );

        :global(svg) {
          transform: rotate(90deg);
        }
      }
    }

    &:has(input:focus-visible) {
      outline: var(--border-thickness-xs) solid var(--color-foreground-switch);
    }

    .trakt-switch-text {
      user-select: none;
      color: var(--color-foreground-switch);

      transition: var(--transition-increment) ease-in-out;
      transition-property: color, transform;

      position: absolute;
      left: var(--text-offset);
      width: var(--text-width);

      transform: translateX(
        calc(var(--button-width) - var(--text-width) - 2 * var(--text-offset))
      );
    }

    .trakt-switch-tick {
      display: flex;
      justify-content: center;
      align-items: center;

      position: absolute;
      top: var(--tick-offset);
      left: var(--tick-offset);

      width: var(--tick-size);
      height: var(--tick-size);

      background: var(--color-tick);
      color: var(--shade-10);
      border-radius: 50%;

      transition: transform var(--transition-increment) ease-in-out;

      :global(svg) {
        transition: transform var(--transition-increment) ease-in-out;
      }

      &::before {
        content: "";

        position: absolute;
        top: 0;
        left: 0;

        width: 100%;
        height: 100%;

        border-radius: 50%;

        box-shadow:
          0px -2px 4px 0px rgba(0, 0, 0, 0.25) inset,
          0px 1px 2px 0px rgba(255, 255, 255, 0.44) inset,
          var(--ni-0) var(--ni-2) var(--ni-8) var(--ni-0) rgba(0, 0, 0, 0.16);
      }
    }
  }

  .trakt-switch.has-custom-icon {
    &:has(input:checked) {
      .trakt-switch-tick {
        :global(svg) {
          transform: rotate(0deg);
        }
      }
    }

    .trakt-switch-tick {
      background: none;
      color: var(--color-foreground-switch);

      :global(svg) {
        width: var(--ni-16);
        height: var(--ni-16);
      }

      &::before {
        display: none;
      }
    }
  }
</style>
