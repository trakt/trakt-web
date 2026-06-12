<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import type { SentimentAnalysis } from "$lib/requests/models/SentimentAnalysis";
  import InfoCard from "../../_internal/InfoCard.svelte";
  import SentimentAspects from "./SentimentAspects.svelte";

  const { sentiment }: { sentiment: SentimentAnalysis } = $props();
</script>

<div class="trakt-sentiment-content">
  <p>{sentiment.analysis}</p>

  <InfoCard variant="highlight">
    <p class="bold">{m.header_sentiment_highlight()}</p>
    <p>{sentiment.highlight}</p>
  </InfoCard>

  <InfoCard>
    <div class="trakt-sentiment-aspects">
      <p class="bold">{m.header_sentiment_aspects()}</p>
      <SentimentAspects
        pros={sentiment.aspect.pros}
        cons={sentiment.aspect.cons}
      />
    </div>
  </InfoCard>
</div>

<style>
  .trakt-sentiment-content {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xl);
  }

  .trakt-sentiment-aspects {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);
  }
</style>
