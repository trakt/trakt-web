<script lang="ts">
  import SentimentIcon from "$lib/components/icons/SentimentIcon.svelte";
  import type { Sentiments } from "$lib/requests/models/Sentiments";

  const SENTIMENT_LIMIT = 2;

  type SentimentProps = {
    sentiments: Sentiments;
    isPartial: boolean;
  };

  const { sentiments, isPartial }: SentimentProps = $props();

  // TODO light mode colors
  const mappedSentiments = $derived([
    {
      sentiments: sentiments.good.slice(0, SENTIMENT_LIMIT),
      sentiment: "good" as const,
      sentimentColor: "var(--purple-200)",
    },
    {
      sentiments: sentiments.bad.slice(0, SENTIMENT_LIMIT),
      sentiment: "bad" as const,
      sentimentColor: "var(--red-100)",
    },
  ]);
</script>

<div class="trakt-sentiment-body">
  {#each mappedSentiments as { sentiment, sentiments, sentimentColor }, index (sentiment)}
    {#if sentiments.length > 0}
      <div
        class="trakt-sentiment-container"
        style="--sentiment-color: {sentimentColor}"
        data-index={!isPartial ? index : undefined}
      >
        <SentimentIcon {sentiment} />
        <ul>
          {#each sentiments as sentiment}
            <li><p>{sentiment}</p></li>
          {/each}
        </ul>
      </div>
    {/if}
  {/each}
</div>

<style>
  .trakt-sentiment-body {
    display: flex;
    flex-direction: column;
    gap: var(--gap-micro);

    height: 100%;
    width: 100%;
  }

  ul {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xxs);

    margin: 0;
    padding: 0;

    font-size: var(--font-size-text);

    list-style-type: none;
  }

  .trakt-sentiment-container {
    flex: 1 1 0;

    display: flex;
    gap: var(--gap-s);
    align-items: flex-start;

    color: var(--color-text-primary);

    border-radius: var(--border-radius-m);

    background-color: var(--color-card-background);
    padding: var(--ni-16);

    :global(svg) {
      flex-shrink: 0;
      color: var(--sentiment-color);
    }

    &[data-index="0"] {
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
    }

    &[data-index="1"] {
      border-top-left-radius: 0;
      border-top-right-radius: 0;
    }
  }
</style>
