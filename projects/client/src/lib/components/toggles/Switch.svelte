<script lang="ts">
  import type { SwitchProps } from "./SwitchProps";

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
    /*
      One flat control with two ingredients: a track and a thumb. No gradient,
      no glow, no shadow, no icon, no text - the row label says what the
      setting is, the track's colour and the thumb's position say what it is
      set to.
    */
    --track-width: var(--ni-44);
    --track-height: var(--ni-24);

    --thumb-size: var(--ni-18);
    --thumb-inset: var(--ni-3);

    /*
      How far the thumb travels, measured rather than hardcoded so the three
      stops stay symmetrical if the geometry is ever retuned: OFF sits at the
      inset, ON at the far end, MIXED at the exact midpoint.
    */
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

    -webkit-tap-highlight-color: transparent;

    transition: background-color var(--transition-increment) ease;

    /*
      44px on the long axis already clears the minimum target; a touch screen
      gets the other axis grown around the control so the row stays as tight
      as it looks.
    */
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

    /*
      POSITION is stated on its own, keyed only on the value, because disabled
      keeps whatever position its value had - a greyed row still has to answer
      "is this on?". ON travels the full span, MIXED stops at the midpoint.
    */
    &:has(input:checked) .trakt-switch-thumb {
      transform: translateX(calc(var(--rtl-sign) * var(--thumb-travel)));
    }

    &:has(input:indeterminate) .trakt-switch-thumb {
      transform: translateX(calc(var(--rtl-sign) * var(--thumb-travel) / 2));
    }

    /*
      COLOUR is stated separately, and every live state excludes :disabled
      explicitly rather than trusting the disabled rule to come last. `:has()`
      takes the specificity of its argument, so `:has(input:checked)` would
      otherwise out-rank `:has(input:disabled)` and a disabled-on switch would
      keep painting itself as ON no matter the source order.

      ON rides --color-switch-track-on, which the tier themes already answer:
      purple for VIP, gold for a director, the white/ink selection for free.
    */
    &:has(input:checked:not(:indeterminate):not(:disabled)) {
      background-color: var(--color-switch-track-on);

      .trakt-switch-thumb {
        background-color: var(--color-switch-thumb-on);
      }
    }

    /*
      MIXED carries its indeterminacy with the thumb's position and a thinned
      track - never a second hue, never a glyph.
    */
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

      /*
        --transition-increment is already 0ms under
        `prefers-reduced-motion: reduce`, so the slide becomes a jump cut
        without a second rule.
      */
      transition: var(--transition-increment) ease;
      transition-property: transform, background-color;
    }
  }
</style>
