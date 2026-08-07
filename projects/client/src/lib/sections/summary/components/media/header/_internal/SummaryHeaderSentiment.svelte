<script lang="ts">
  import type { SummarySentiment } from "./toSummarySentiment.ts";

  /*
    Verdict pill plus up to three single-clause bullets, unboxed in both
    directions. The verdict drives the pill and the bullet dots, so colour is
    never the only signal - the pill always states the verdict in words.
  */
  const { sentiment }: { sentiment: SummarySentiment } = $props();
</script>

<div class="trakt-summary-header-sentiment" data-verdict={sentiment.verdict}>
  <span class="sentiment-pill">{sentiment.label}</span>

  <ul class="sentiment-bullets">
    {#each sentiment.bullets as bullet (bullet)}
      <li>
        <span class="bullet-marker" aria-hidden="true">
          <span class="bullet-dot"></span>
        </span>
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
      --sentiment-color: var(--green-400);
    }

    &[data-verdict="mixed"] {
      --sentiment-color: var(--yellow-400);
    }

    &[data-verdict="negative"] {
      --sentiment-color: var(--red-400);
    }
  }

  .sentiment-pill {
    font-size: var(--font-size-tag);
    font-weight: 700;
    letter-spacing: 0.13em;
    text-transform: uppercase;

    padding: var(--ni-4) var(--ni-10);
    border-radius: 999px;

    color: var(--sentiment-color);
    background: color-mix(in srgb, var(--sentiment-color) 16%, transparent);
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
      /*
        The marker box is only as wide as the dot, so this gap is the entire
        separation between the two - at 8px the dot crowded the text.
      */
      gap: var(--gap-s);
    }
  }

  /*
    A box exactly one line of bullet text tall, centring the dot inside it. This
    replaces a hand-tuned `margin-top`, which only ever approximated the first
    line's centre and drifted as soon as the font size or line-height moved - the
    dots read as slightly raised. Derived from the same two values the text uses,
    so it stays centred by construction.
  */
  .bullet-marker {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: none;

    width: var(--ni-4);
    height: calc(var(--font-size-text) * 1.5);
  }

  .bullet-dot {
    width: var(--ni-4);
    height: var(--ni-4);

    border-radius: 999px;
    background: var(--sentiment-color);
  }

  .bullet-text {
    font-size: var(--font-size-text);
    line-height: 1.5;
    color: var(--color-text-secondary);
    text-wrap: pretty;
  }
</style>
