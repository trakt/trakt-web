<script lang="ts">
  import Link from "$lib/components/link/Link.svelte";
  import TrophyIcon from "$lib/components/icons/TrophyIcon.svelte";
  import SummaryHeaderLabel from "../../../header-kit/SummaryHeaderLabel.svelte";

  /*
    "Movie · Comedy" above the title.

    - `plain` (anchored) is the kicker on its own. It used to trail a hairline out
      to the column edge; that rule read as noise once the header lost its outer
      frame, so it is gone.
    - `inline` (masthead) sits centred and carries the release status after a
      dot, because the masthead has no facts strip to put it in.
  */
  type KickerAwards = {
    label: string;
    href: string;
    ariaLabel: string;
    noscroll?: boolean;
    replacestate?: boolean;
  };

  const {
    kicker,
    status,
    awards,
    variant = "plain",
  }: {
    kicker: string;
    status?: string | Nil;
    /** A gold fourth item - TYPE · GENRE · STATUS · trophy AWARDS. */
    awards?: KickerAwards | Nil;
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

  {#if variant === "inline" && awards}
    <span class="kicker-separator" aria-hidden="true">·</span>
    <Link
      href={awards.href}
      noscroll={awards.noscroll}
      replacestate={awards.replacestate}
      color="inherit"
      label={awards.ariaLabel}
    >
      <span class="kicker-awards">
        <span class="kicker-trophy" aria-hidden="true"><TrophyIcon /></span>
        <SummaryHeaderLabel text={awards.label} />
      </span>
    </Link>
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

  /*
    The awards item keeps the run's typography and takes gold - the third
    colour in the row, earned by being the only item that is also a door
    (it opens the awards drawer).
  */
  .trakt-summary-header-kicker :global(a) {
    text-decoration: none;
    display: inline-flex;
  }

  .kicker-awards {
    display: inline-flex;
    align-items: center;
    gap: var(--ni-4);

    --summary-header-label-color: var(--yellow-400);
    color: var(--yellow-400);

    transition: filter var(--transition-increment) ease-in-out;
  }

  .trakt-summary-header-kicker :global(a:hover .kicker-awards),
  .trakt-summary-header-kicker :global(a:focus-visible .kicker-awards) {
    filter: brightness(1.2);
  }

  /*
    Nested under .kicker-awards for specificity: Link pins inner spans to
    color: inherit at (0,2,1), which beat the single class and greyed the
    trophy's currentColor. Two scoped classes outrank the pin.
  */
  .kicker-awards .kicker-trophy {
    display: inline-flex;

    color: var(--yellow-400);

    :global(svg) {
      width: var(--ni-12);
      height: var(--ni-12);
    }
  }

  /* Matches SummaryHeaderLabel exactly, so it reads as one continuous run. */
  .kicker-separator {
    font-size: var(--font-size-tag);
    font-weight: 700;
    color: var(--color-text-quiet);
  }

</style>
