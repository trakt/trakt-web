<script lang="ts">
  import SentimentIcon from "$lib/components/icons/SentimentIcon.svelte";
  import type { Sentiments } from "$lib/requests/models/Sentiments";

  const SENTIMENT_LIMIT = 2;

  type SentimentProps = {
    sentiments: Sentiments;
  };

  const { sentiments }: SentimentProps = $props();

  const mappedSentiments = $derived([
    {
      sentiments: sentiments.good.slice(0, SENTIMENT_LIMIT),
      sentiment: "good" as const,
      backgroundColor: "var(--purple-600)",
    },
    {
      sentiments: sentiments.bad.slice(0, SENTIMENT_LIMIT),
      sentiment: "bad" as const,
      backgroundColor: "var(--purple-900)",
    },
  ]);
</script>

<div class="trakt-sentiment-body">
  {#each mappedSentiments as { sentiment, sentiments, backgroundColor }}
    {#if sentiments.length > 0}
      <div
        class="trakt-sentiment-container"
        style="--sentiment-background-color: {backgroundColor}"
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
    gap: var(--gap-xxs);

    flex-grow: 1;
  }

  ul {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xxs);

    margin: 0;
    padding: 0;
    padding-left: var(--gap-m);

    font-size: var(--font-size-text);

    list-style-type: none;

    border-left: 1px solid
      color-mix(in srgb, var(--color-text-primary) 10%, transparent);
  }

  .trakt-sentiment-container {
    flex: 1 1 0;

    display: flex;
    gap: var(--gap-m);
    align-items: center;

    color: var(--color-text-primary);

    background-color: color-mix(
      in srgb,
      var(--sentiment-background-color) 35%,
      var(--color-card-background)
    );

    padding: var(--gap-m);
    border-radius: var(--border-radius-m);

    :global(svg) {
      flex-shrink: 0;
    }
  }
</style>
