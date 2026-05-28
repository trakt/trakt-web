<script lang="ts">
  import type { ListVariant } from "$lib/components/lists/section-list/ListVariant";
  import SectionList from "$lib/components/lists/section-list/SectionList.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { MediaType } from "$lib/requests/models/MediaType";
  import type { SentimentAnalysis } from "$lib/requests/models/SentimentAnalysis.ts";
  import SentimentCard from "./_internal/SentimentCard.svelte";

  const {
    sentiment,
    variant,
    type,
  }: {
    sentiment: SentimentAnalysis | Nil;
    variant?: ListVariant;
    type: MediaType;
  } = $props();
</script>

{#if sentiment}
  <SectionList
    id={`sentiment-${type}`}
    items={[{ ...sentiment, key: "sentiment" }]}
    title={m.header_community_sentiment()}
    {variant}
    --height-list="var(--height-sentiment-list)"
  >
    {#snippet item(sentiment)}
      <SentimentCard {sentiment} />
    {/snippet}
  </SectionList>
{/if}
