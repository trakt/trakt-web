<script lang="ts">
  import RateIcon from "$lib/components/icons/RateIcon.svelte";
  import { SimpleRating } from "$lib/models/SimpleRating";
  import type { Sentiments } from "$lib/requests/models/Sentiments";
  import SentimentHeader from "./SentimentHeader.svelte";
  import ShadowScroller from "./ShadowScroller.svelte";

  type SentimentProps = {
    comment: Sentiments;
  };

  const { comment }: SentimentProps = $props();

  const mappedSentiments = [
    {
      sentiments: comment.good,
      rating: SimpleRating.Good,
      color: "var(--color-text-sentiment-good)",
    },
    {
      sentiments: comment.bad,
      rating: SimpleRating.Bad,
      color: "var(--color-text-sentiment-bad)",
    },
  ];
</script>

<SentimentHeader {comment} />
<ShadowScroller>
  <div class="trakt-sentiment-body">
    {#each mappedSentiments as { rating, sentiments, color }}
      <div class="trakt-sentiment-container">
        <RateIcon {rating} --icon-fill-color={color} />
        <ol>
          {#each sentiments as sentiment}
            <li><p class="small">{sentiment}</p></li>
          {/each}
        </ol>
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

  ol {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xxs);

    margin: 0;
    padding: 0;
    padding-left: var(--ni-24);

    font-size: var(--ni-14);
  }

  .trakt-sentiment-container {
    display: flex;
    gap: var(--gap-s);
  }
</style>
