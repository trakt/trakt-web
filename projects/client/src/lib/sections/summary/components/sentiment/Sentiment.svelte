<script lang="ts">
  import type { ListVariant } from "$lib/components/lists/section-list/ListVariant";
  import SectionList from "$lib/components/lists/section-list/SectionList.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { MediaType } from "$lib/requests/models/MediaType";
  import type { RealityCheck } from "$lib/requests/models/RealityCheck.ts";
  import type { SentimentAnalysis } from "$lib/requests/models/SentimentAnalysis.ts";
  import SentimentCard from "./_internal/SentimentCard.svelte";

  type SentimentProps = {
    sentiment: SentimentAnalysis | Nil;
    realityCheck: RealityCheck | null | undefined;
    slug: string;
    variant?: ListVariant;
    type: MediaType;
  };

  const { sentiment, realityCheck, slug, variant, type }: SentimentProps =
    $props();
</script>

{#if sentiment !== null || realityCheck !== null}
  <SectionList
    id={{
      scope: `sentiment-list-${type}`,
      key: slug,
    }}
    items={[{ key: "sentiment" }]}
    title={m.header_insights()}
    {variant}
    --height-list="var(--height-sentiment-list)"
  >
    {#snippet item()}
      <SentimentCard {sentiment} {realityCheck} />
    {/snippet}
  </SectionList>
{/if}
