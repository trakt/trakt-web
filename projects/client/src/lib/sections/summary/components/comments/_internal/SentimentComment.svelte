<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import type { Sentiments } from "$lib/requests/models/Sentiments";
  import ShadowScroller from "./ShadowScroller.svelte";

  type SentimentProps = {
    comment: Sentiments;
  };

  const { comment }: SentimentProps = $props();

  const mappedSentiments = [
    {
      title: m.the_good(),
      sentiments: comment.good.map((s) => `🔥 ${s}`),
    },
    {
      title: m.the_bad(),
      sentiments: comment.bad.map((s) => `🤮 ${s}`),
    },
  ];
</script>

<div class="trakt-sentiment-header">
  <p>{m.community_voice()}</p>
</div>
<ShadowScroller>
  <div class="trakt-sentiment-body">
    {#each mappedSentiments as { title, sentiments }}
      <div class="trakt-sentiment-group">
        <p class="small meta-info">{title}</p>
        {#each sentiments as sentiment}
          <p class="small">{sentiment}</p>
        {/each}
      </div>
    {/each}
  </div>
</ShadowScroller>

<style>
  .trakt-sentiment-group {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);
  }

  .trakt-sentiment-body {
    display: flex;
    flex-direction: column;
    gap: var(--gap-m);

    color: var(--color-text-secondary);
  }
</style>
