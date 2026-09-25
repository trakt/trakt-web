<script lang="ts">
  import type { SwitchProps } from "./SwitchProps.ts";

  const {
    label,
    navigationType,
    checked,
    indeterminate,
    ...props
  }: SwitchProps = $props();
</script>

<label class="trakt-switch">
  <input
    type="checkbox"
    role="switch"
    aria-label={label}
    data-dpad-navigation={navigationType}
    {checked}
    {indeterminate}
    {...props}
  />

  <span class="trakt-switch-thumb"></span>
</label>

<style lang="scss">
  @use "$style/scss/mixins/index.scss" as *;

  .trakt-switch {
    --track-width: var(--ni-44);
    --track-height: var(--ni-24);

    --thumb-size: var(--ni-18);
    --thumb-inset: var(--ni-3);

    --thumb-travel: calc(
      var(--track-width) - var(--thumb-size) - 2 * var(--thumb-inset)
    );

    all: unset;
    box-sizing: border-box;
    cursor: pointer;

    display: block;
    position: relative;
    flex: none;

    width: var(--track-width);
    height: var(--track-height);

    border-radius: var(--border-radius-xxl);
    background-color: var(--color-switch-track-off);
    box-shadow: inset 0 var(--ni-1) var(--ni-2) var(--color-switch-track-shadow);

    -webkit-tap-highlight-color: transparent;

    transition: var(--transition-increment) ease;
    transition-property: background-color, box-shadow;

    @include for-touch {
      &::before {
        content: "";

        position: absolute;
        inset-inline: 0;
        top: calc((var(--track-height) - var(--ni-44)) / 2);

        height: var(--ni-44);
      }
    }

    input {
      position: absolute;

      opacity: 0;
      width: 0;
      height: 0;
    }

    &:has(input:focus-visible) {
      outline: var(--border-thickness-xs) solid var(--color-input-focus);
      outline-offset: var(--ni-2);
    }

    &:has(input:checked) .trakt-switch-thumb {
      transform: translateX(calc(var(--rtl-sign) * var(--thumb-travel)));
    }

    &:has(input:indeterminate) .trakt-switch-thumb {
      transform: translateX(calc(var(--rtl-sign) * var(--thumb-travel) / 2));
    }

    /* :has() takes its argument's specificity, so live states exclude :disabled explicitly. */
    &:has(input:checked:not(:indeterminate):not(:disabled)) {
      background-color: var(--color-switch-track-on);

      .trakt-switch-thumb {
        background-color: var(--color-switch-thumb-on);
      }
    }

    &:has(input:indeterminate:not(:disabled)) {
      background-color: color-mix(
        in srgb,
        var(--color-switch-track-on) 40%,
        transparent
      );
    }

    &:has(input:disabled) {
      cursor: not-allowed;
      background-color: var(--color-switch-track-disabled);
      box-shadow: none;

      .trakt-switch-thumb {
        background-color: var(--color-switch-thumb-disabled);
      }
    }

    .trakt-switch-thumb {
      display: block;
      position: absolute;
      top: var(--thumb-inset);
      inset-inline-start: var(--thumb-inset);

      width: var(--thumb-size);
      height: var(--thumb-size);

      border-radius: 50%;
      background-color: var(--color-switch-thumb);

      transition: var(--transition-increment) ease;
      transition-property: transform, background-color;
    }
  }
</style>
