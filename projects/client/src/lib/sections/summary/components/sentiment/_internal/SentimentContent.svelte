<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import type { SentimentAnalysis } from "$lib/requests/models/SentimentAnalysis";
  import SentimentAspects from "./SentimentAspects.svelte";

  const { sentiment }: { sentiment: SentimentAnalysis } = $props();
</script>

<div class="trakt-sentiment-content">
  <p>{sentiment.analysis}</p>
  <div class="trakt-sentiment-highlight">
    <p class="bold">{m.header_sentiment_highlight()}</p>
    <p>{sentiment.highlight}</p>
  </div>

  <div class="trakt-sentiment-aspects">
    <p class="bold">{m.header_sentiment_aspects()}</p>
    <SentimentAspects
      pros={sentiment.aspect.pros}
      cons={sentiment.aspect.cons}
    />
  </div>
</div>

<style>
  .trakt-sentiment-content {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xl);
  }

  .trakt-sentiment-highlight {
    position: relative;

    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);

    padding: var(--ni-16);

    overflow: hidden;
    background: var(--background-sentiment-highlight);

    border-radius: var(--border-radius-m);
    border: var(--ni-1) solid var(--color-sentiment-highlight-border);
  }

  .trakt-sentiment-highlight::before {
    content: "";

    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    background: linear-gradient(
      90deg,
      transparent 0%,
      var(--color-sentiment-highlight-border) 50%,
      transparent 100%
    );

    transform: translateX(-100%);
    animation: slide calc(5 * var(--transition-increment)) ease-in-out;
  }

  .trakt-sentiment-aspects {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);

    :global(.trakt-sentiment-container) {
      background: var(--background-sentiment-highlight);
    }
  }
</style>
