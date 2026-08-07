<script lang="ts">
  import SummaryHeaderLabel from "../../../header-kit/SummaryHeaderLabel.svelte";

  /*
    "Movie · Comedy" above the title.

    - `plain` (anchored) is the kicker on its own. It used to trail a hairline out
      to the column edge; that rule read as noise once the header lost its outer
      frame, so it is gone.
    - `inline` (masthead) sits centred and carries the release status after a
      dot, because the masthead has no facts strip to put it in.
  */
  const {
    kicker,
    status,
    variant = "plain",
  }: {
    kicker: string;
    status?: string | Nil;
    variant?: "plain" | "inline";
  } = $props();
</script>

<div class="trakt-summary-header-kicker" data-variant={variant}>
  <span class="kicker-text">
    <SummaryHeaderLabel text={kicker} />
  </span>

  {#if variant === "inline" && status}
    <!--
      The same interpunct the kicker string itself uses to join type and genre
      (see mapToSummaryHeaderKicker), rather than a CSS circle. Two different
      separator mechanisms in one row can never agree on size; one glyph always
      does.
    -->
    <span class="kicker-separator" aria-hidden="true">·</span>
    <SummaryHeaderLabel text={status} />
  {/if}
</div>

<style lang="scss">
  .trakt-summary-header-kicker {
    display: flex;
    align-items: center;

    &[data-variant="plain"] {
      gap: var(--gap-m);
    }

    &[data-variant="inline"] {
      /*
        Tight, to match the single space either side of the interpunct inside the
        kicker string. A wider gap here makes the status read as a separate item
        rather than part of the same run.
      */
      gap: var(--gap-xxs);
      justify-content: center;

      --summary-header-label-tracking: 0.18em;
    }
  }

  .kicker-text {
    --summary-header-label-color: var(--purple-300);
    --summary-header-label-tracking: 0.16em;

    display: inline-flex;
  }

  .trakt-summary-header-kicker[data-variant="inline"] .kicker-text {
    --summary-header-label-tracking: 0.18em;
  }

  /* Matches SummaryHeaderLabel exactly, so it reads as one continuous run. */
  .kicker-separator {
    font-size: var(--font-size-tag);
    font-weight: 700;
    color: var(--color-text-secondary);
  }

</style>
