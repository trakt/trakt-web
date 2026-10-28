<script lang="ts">
  /*
    A state, as a pill: the community verdict, the viewer's standing. One
    construction so the two never drift - 22px tall, a 16% tint of its colour,
    the label in the header's small caps. Colour is never the only signal; the
    pill always says its state in words.

    Pills mark STATE, text marks counts - the strip keeps exactly two colour
    anchors (verdict and standing), so a count never arrives here as a pill.
  */
  type StatePillTone =
    | "positive"
    | "mixed"
    | "negative"
    | "behind"
    | "caught-up"
    | "neutral";

  const { label, tone }: { label: string; tone: StatePillTone } = $props();
</script>

<span class="trakt-summary-header-state-pill" data-tone={tone}>{label}</span>

<style lang="scss">
  .trakt-summary-header-state-pill {
    display: inline-flex;
    align-items: center;

    height: var(--ni-22);
    padding: 0 var(--ni-10);
    box-sizing: border-box;
    border-radius: 999px;

    font-size: var(--font-size-tag);
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    white-space: nowrap;

    color: var(--state-pill-color);
    background: color-mix(in srgb, var(--state-pill-color) 16%, transparent);

    &[data-tone="positive"],
    &[data-tone="caught-up"] {
      --state-pill-color: var(--green-400);
    }

    &[data-tone="mixed"] {
      --state-pill-color: var(--yellow-400);
    }

    &[data-tone="negative"] {
      --state-pill-color: var(--red-400);
    }

    &[data-tone="behind"] {
      --state-pill-color: var(--orange-600);
    }

    &[data-tone="neutral"] {
      --state-pill-color: var(--color-text-secondary);
    }
  }
</style>
