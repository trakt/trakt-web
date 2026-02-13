<script lang="ts">
  import type { ListVariant } from "$lib/components/lists/section-list/ListVariant";
  import SectionList from "$lib/components/lists/section-list/SectionList.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { SentimentAnalysis } from "$lib/requests/models/SentimentAnalysis.ts";
  import SentimentCard from "./_internal/SentimentCard.svelte";

  const {
    sentiment,
    slug,
    variant,
  }: {
    sentiment: SentimentAnalysis | Nil;
    slug: string;
    variant?: ListVariant;
  } = $props();

  const hasPartialSentiment = $derived.by(() => {
    if (!sentiment) return false;
    return (
      sentiment.aspect.pros.length === 0 || sentiment.aspect.cons.length === 0
    );
  });

  const heightList = $derived(
    hasPartialSentiment
      ? "calc(0.5 * var(--height-sentiment-list))"
      : "var(--height-sentiment-list)",
  );
</script>

{#if sentiment}
  <SectionList
    id={`sentiment-${slug}`}
    items={[{ ...sentiment, key: "sentiment" }]}
    title={m.header_community_sentiment()}
    {variant}
    --height-list={heightList}
  >
    {#snippet item(sentiment)}
      <SentimentCard {sentiment} isPartial={hasPartialSentiment} />
    {/snippet}
  </SectionList>
{/if}
