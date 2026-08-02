<script lang="ts">
  import { getLocale } from "$lib/features/i18n";
  import { toGroupedNumber } from "$lib/utils/formatting/number/toGroupedNumber.ts";
  import type { OdometerNumberProps } from "./_internal/OdometerNumberProps.ts";
  import { toDigitPosition } from "./_internal/toDigitPosition.ts";
  import { toLocaleDigits } from "./_internal/toLocaleDigits.ts";
  import { toOdometerCells } from "./_internal/toOdometerCells.ts";

  const { value, accessibleLabel, reserveFor = value }: OdometerNumberProps =
    $props();

  // Forced true: prefers-reduced-motion is always treated as active.
  const isReduced = true;

  const locale = $derived(getLocale());
  // Deriving off the floored value keeps `Intl` out of the frame loop; the roll
  // offsets below are pure arithmetic on the raw float.
  const whole = $derived(Math.floor(value));
  const cells = $derived(toOdometerCells({ value: whole, locale }));
  const text = $derived(toGroupedNumber(whole, locale));
  // Trailing repeat of the first glyph makes the 9 -> 0 wrap seamless.
  const strip = $derived.by(() => {
    const digits = toLocaleDigits(locale);
    return [...digits, ...digits.slice(0, 1)];
  });
  const reserved = $derived(
    toGroupedNumber(Math.floor(reserveFor), locale).length,
  );
</script>

<span class="trakt-odometer-number" style="--character-count: {reserved}">
  <span class="odometer-label">{accessibleLabel}</span>

  {#if isReduced}
    <span class="odometer-static" aria-hidden="true" aria-live="off">
      {text}
    </span>
  {:else}
    <span class="odometer-cells" aria-hidden="true" aria-live="off">
      {#each cells as cell, index (index)}
        {#if cell.kind === "separator"}
          <span class="odometer-separator">{cell.text}</span>
        {:else}
          <span
            class="odometer-digit"
            style="--position: {toDigitPosition({ value, place: cell.place })}"
          >
            <span class="digit-strip">
              {#each strip as glyph, position (position)}
                <span class="digit-glyph">{glyph}</span>
              {/each}
            </span>
          </span>
        {/if}
      {/each}
    </span>
  {/if}
</span>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  // The global `span` rule pins font-size and weight, and cell geometry is in
  // `em`, so one span left at body size collapses its column. Every span in the
  // reel has to opt back into inheriting, not just the classed ones.
  .trakt-odometer-number,
  .trakt-odometer-number span {
    font-size: inherit;
    font-weight: inherit;
  }

  .trakt-odometer-number {
    // Cell box is taller than the glyph so ascenders never clip mid-roll.
    --odometer-cell-height: 1.15em;

    display: inline-flex;
    justify-content: center;
    // Numbers read most-significant-first in every locale, RTL included, so the
    // digit run is not a layout side that should mirror.
    direction: ltr;

    min-width: calc(var(--character-count) * 1ch);

    font-variant-numeric: tabular-nums;
    font-feature-settings: "tnum";
  }

  .odometer-label {
    @include visually-hidden;
  }

  .odometer-cells {
    display: inline-flex;
    align-items: flex-start;
  }

  .odometer-separator,
  .odometer-digit {
    // Shared box model, so digit/separator alignment is structural rather than a
    // per-font baseline negotiation.
    display: inline-block;
    height: var(--odometer-cell-height);
    line-height: var(--odometer-cell-height);
    text-align: center;
  }

  .odometer-digit {
    width: 1ch;
    overflow: hidden;
  }

  .digit-strip {
    display: block;
    // No CSS transition: easing already happened in the projection, and a
    // transition would animate the 9 -> 0 wrap backwards through the strip.
    transform: translateY(
      calc(var(--position) * var(--odometer-cell-height) * -1)
    );
    will-change: transform;
  }

  .digit-glyph {
    display: block;
    height: var(--odometer-cell-height);
    line-height: var(--odometer-cell-height);
  }
</style>
