<script lang="ts">
  import type { ListVariant } from "$lib/components/lists/section-list/ListVariant";
  import SectionList from "$lib/components/lists/section-list/SectionList.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { MediaType } from "$lib/requests/models/MediaType";
  import type { SentimentAnalysis } from "$lib/requests/models/SentimentAnalysis.ts";
  import SentimentCard from "./_internal/SentimentCard.svelte";

  type SentimentProps = {
    sentiment: SentimentAnalysis | Nil;
    slug: string;
    variant?: ListVariant;
    type: MediaType;
  };

  const { sentiment, slug, variant, type }: SentimentProps = $props();
</script>

{#if sentiment}
  <SectionList
    id={{
      scope: `sentiment-list-${type}`,
      key: slug,
    }}
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
