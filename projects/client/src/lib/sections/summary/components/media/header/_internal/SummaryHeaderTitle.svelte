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

    &[data-size="large"] {
      font-size: var(--title-size-large, var(--ni-64));
      line-height: 1.02;
    }

    &[data-size="medium"] {
      font-size: var(--title-size-medium, var(--ni-52));
      line-height: 1.03;
    }

    &[data-size="small"] {
      font-size: var(--title-size-small, var(--ni-44));
      line-height: 1.04;
    }

    @include for-tablet-lg {
      &[data-size="large"] {
        font-size: var(--ni-48);
      }

      &[data-size="medium"] {
        font-size: var(--ni-40);
      }

      &[data-size="small"] {
        font-size: var(--ni-32);
      }
    }
  }
</style>
