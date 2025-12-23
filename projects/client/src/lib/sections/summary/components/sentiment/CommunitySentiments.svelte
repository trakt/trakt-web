<script lang="ts">
  import type { ListVariant } from "$lib/components/lists/section-list/ListVariant";
  import SectionList from "$lib/components/lists/section-list/SectionList.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { Sentiments } from "$lib/requests/models/Sentiments";
  import SentimentsCard from "./_internal/SentimentsCard.svelte";

  const {
    sentiments,
    slug,
    variant,
  }: { sentiments: Sentiments | Nil; slug: string; variant?: ListVariant } =
    $props();

  const hasPartialSentiments = $derived.by(() => {
    if (!sentiments) return false;
    return sentiments.good.length === 0 || sentiments.bad.length === 0;
  });

  const heightList = $derived(
    hasPartialSentiments
      ? "calc(0.5 * var(--height-sentiments-list))"
      : "var(--height-sentiments-list)",
  );
</script>

{#if sentiments}
  <SectionList
    id={`community-sentiments-${slug}`}
    items={[{ ...sentiments, key: "sentiment" }]}
    title={m.header_community_sentiment()}
    {variant}
    --height-list={heightList}
  >
    {#snippet item(sentiments)}
      <SentimentsCard {sentiments} isPartial={hasPartialSentiments} />
    {/snippet}
  </SectionList>
{/if}
