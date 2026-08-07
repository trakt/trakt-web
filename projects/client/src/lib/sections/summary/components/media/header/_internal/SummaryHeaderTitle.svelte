<script lang="ts">
  import { TestId } from "$e2e/models/TestId";
  import { toTitleSizeBucket } from "./toTitleSizeBucket.ts";

  /*
    Length-responsive title. The size step comes from how many characters have
    to fit, not from the viewport - see toTitleSizeBucket. Each direction maps
    the bucket to its own step via `--title-size-*`, so the 83-character
    worst-case title wraps inside its measure instead of blowing out the
    vertical rhythm.
  */
  const { title }: { title: string } = $props();

  const bucket = $derived(toTitleSizeBucket(title));
</script>

<h1
  class="trakt-summary-header-title"
  data-size={bucket}
  data-testid={TestId.SummaryMediaTitle}
>
  {title}
</h1>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-summary-header-title {
    font-weight: 700;
    letter-spacing: -0.03em;
    color: var(--color-text-primary);

    /*
      Caps the measure so a long title wraps to 2-3 lines rather than one very
      wide line. `balance` evens those lines out.
    */
    text-wrap: balance;
    max-width: var(--title-measure, 22ch);

    /*
      Two independent axes, and they must not be confused:

      - WHICH bucket applies comes from the title's length (see toTitleSizeBucket).
      - How large that bucket renders comes from the viewport, via clamp.

      The length buckets alone were not enough: a short title still took its full
      64px on a phone. And a viewport clamp alone cannot express the length axis at
      all. Each bucket therefore carries its own fluid range, so a long title stays
      the smallest option at every width rather than only at the design width.
    */
    &[data-size="large"] {
      font-size: var(--title-size-large, clamp(var(--ni-32), 5vw, var(--ni-64)));
      line-height: 1.02;
    }

    &[data-size="medium"] {
      font-size: var(
        --title-size-medium,
        clamp(var(--ni-28), 4.2vw, var(--ni-52))
      );
      line-height: 1.03;
    }

    &[data-size="small"] {
      font-size: var(
        --title-size-small,
        clamp(var(--ni-24), 3.6vw, var(--ni-44))
      );
      line-height: 1.04;
    }
  }
</style>
