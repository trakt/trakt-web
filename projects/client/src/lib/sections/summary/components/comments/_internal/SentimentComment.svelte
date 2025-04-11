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
    },
    {
      sentiments: comment.bad,
      rating: SimpleRating.Bad,
    },
  ];
</script>

<SentimentHeader {comment} />
<ShadowScroller>
  <div class="trakt-sentiment-body">
    {#each mappedSentiments as { rating, sentiments }}
      <div
        class="trakt-sentiment-container"
        class:sentiment-good={rating === SimpleRating.Good}
        class:sentiment-bad={rating === SimpleRating.Bad}
      >
        <RateIcon {rating} />
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

  .sentiment-good {
    color: var(--color-text-sentiment-good);
  }

  .sentiment-bad {
    color: var(--color-text-sentiment-bad);
  }
</style>
