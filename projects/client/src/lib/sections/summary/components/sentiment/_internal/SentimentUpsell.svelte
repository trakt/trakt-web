<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import UpsellCta from "$lib/features/upsell/UpsellCta.svelte";
  import { MOCK_SENTIMENT } from "./constants";
  import SentimentContent from "./SentimentContent.svelte";
</script>

<div class="trakt-sentiment-upsell">
  <UpsellCta source="sentiment">
    {m.text_vip_upsell_sentiment()}
  </UpsellCta>

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
</style>
