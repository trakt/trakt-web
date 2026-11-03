<script lang="ts">
  import SummaryHeaderBulletDot from "../../../header-kit/SummaryHeaderBulletDot.svelte";
  import SummaryHeaderStatePill from "../../../header-kit/SummaryHeaderStatePill.svelte";
  import type { SummarySentiment } from "../../../header-kit/toSummarySentiment.ts";

  /*
    Verdict pill plus up to three single-clause bullets, unboxed in both
    directions. The verdict drives the pill and the bullet dots, so colour is
    never the only signal - the pill always states the verdict in words.

    The masthead strip seats the verdict on its shared subline instead, so it
    asks for the bullets alone with `showVerdict={false}`.
  */
  const {
    sentiment,
    showVerdict = true,
  }: { sentiment: SummarySentiment; showVerdict?: boolean } = $props();
</script>

<div class="trakt-summary-header-sentiment" data-verdict={sentiment.verdict}>
  {#if showVerdict}
    <SummaryHeaderStatePill label={sentiment.label} tone={sentiment.verdict} />
  {/if}

  <ul class="sentiment-bullets">
    {#each sentiment.bullets as bullet (bullet)}
      <li>
        <SummaryHeaderBulletDot />
        <span class="bullet-text">{bullet}</span>
      </li>
    {/each}
  </ul>
</div>

<style lang="scss">
  .trakt-summary-header-sentiment {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--gap-s);

    &[data-verdict="positive"] {
      --summary-header-bullet-color: var(--green-400);
    }

    &[data-verdict="mixed"] {
      --summary-header-bullet-color: var(--yellow-400);
    }

    &[data-verdict="negative"] {
      --summary-header-bullet-color: var(--red-400);
    }
  }

  .sentiment-bullets {
    display: flex;
    flex-direction: column;
    gap: var(--sentiment-bullet-gap, var(--gap-s));

    margin: 0;
    padding: 0;
    list-style: none;

    li {
      display: flex;
      align-items: flex-start;
      /* The marker box is only as wide as the dot: this gap is the whole
         separation between the two. */
      gap: var(--ni-10);
    }
  }

  .bullet-text {
    font-size: var(--font-size-text);
    line-height: var(--ni-20);
    color: var(--color-text-primary);
    text-wrap: pretty;
  }
</style>
