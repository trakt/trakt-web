<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import GetVIPLink from "$lib/sections/navbar/components/GetVIPLink.svelte";
  import { MOCK_SENTIMENT } from "./constants";
  import SentimentContent from "./SentimentContent.svelte";
</script>

<div class="trakt-sentiment-upsell">
  <div class="trakt-sentiment-upsell-cta">
    <div>
      <p class="bold">{m.text_vip_upsell_dive_deeper()}</p>
      <p class="tag secondary">{m.text_vip_upsell_sentiment()}</p>
    </div>
    <GetVIPLink />
  </div>

  <div class="trakt-sentiment-example">
    <p class="bold italic secondary">
      {m.text_sentiment_example({ title: MOCK_SENTIMENT.title })}
    </p>
    <SentimentContent sentiment={MOCK_SENTIMENT.sentiment} />
  </div>
</div>

<style>
  .trakt-sentiment-upsell {
    display: flex;
    flex-direction: column;
    gap: var(--gap-m);
  }

  .trakt-sentiment-upsell-cta,
  .trakt-sentiment-example {
    padding: var(--ni-12);
    border: var(--ni-1) solid var(--color-sentiment-highlight-border);
    border-radius: var(--border-radius-m);
  }

  .trakt-sentiment-example {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);
  }

  .trakt-sentiment-upsell-cta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--gap-m);

    background-color: var(--color-card-background);
  }
</style>
