<script lang="ts">
  import SentimentIcon from "$lib/components/icons/SentimentIcon.svelte";
  import type { Sentiments } from "$lib/requests/models/Sentiments";
  import ShadowScroller from "../../comments/_internal/ShadowScroller.svelte";

  type SentimentProps = {
    sentiments: Sentiments;
  };

  const { sentiments }: SentimentProps = $props();

  const mappedSentiments = [
    {
      sentiments: sentiments.good,
      sentiment: "good" as const,
      color: "var(--color-text-sentiment-good)",
    },
    {
      sentiments: sentiments.bad,
      sentiment: "bad" as const,
      color: "var(--color-text-sentiment-bad)",
    },
  ];
</script>

<ShadowScroller>
  <div class="trakt-sentiment-body">
    {#each mappedSentiments as { sentiment, sentiments, color }}
      <div class="trakt-sentiment-container" style="--sentiment-color: {color}">
        <SentimentIcon {sentiment} --icon-fill-color={color} />
        <ul>
          {#each sentiments as sentiment}
            <li><p>{sentiment}</p></li>
          {/each}
        </ul>
      </div>
    {/each}
  </div>
</ShadowScroller>

<style>
  .trakt-sentiment-body {
    display: flex;
    flex-direction: column;
    gap: var(--gap-m);
  }

  ul {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xxs);

    margin: 0;
    padding: 0;
    padding-left: var(--ni-24);

    font-size: var(--font-size-text);
  }

  .trakt-sentiment-container {
    display: flex;
    gap: var(--gap-xs);

    color: var(--sentiment-color);

    :global(svg) {
      flex-shrink: 0;
    }
  }
</style>
