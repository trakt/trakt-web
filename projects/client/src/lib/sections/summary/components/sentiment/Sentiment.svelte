<script lang="ts">
  import { fromRune } from "$lib/utils/store/fromRune.svelte.ts";
  import type { ListVariant } from "$lib/components/lists/section-list/ListVariant";
  import SectionList from "$lib/components/lists/section-list/SectionList.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { MediaType } from "$lib/requests/models/MediaType";
  import type { RealityCheckVariant } from "$lib/requests/models/RealityCheckVariant.ts";
  import type { SentimentAnalysis } from "$lib/requests/models/SentimentAnalysis.ts";
  import InsightsCard from "./_internal/InsightsCard.svelte";
  import SentimentCard from "./_internal/SentimentCard.svelte";
  import { useInsightsCard } from "./useInsightsCard.ts";
  import { useMatch } from "./useMatch.ts";

  type SentimentProps = {
    sentiment: SentimentAnalysis | Nil;
    realityCheck: RealityCheckVariant | null | undefined;
    slug: string;
    id: number;
    variant?: ListVariant;
    type: MediaType;
  };

  const { sentiment, realityCheck, slug, id, variant, type }: SentimentProps =
    $props();

  const { match, isAvailable } = useMatch(fromRune(() => ({ type, id })));
  const { isInsightsCard } = useInsightsCard();
</script>

{#if sentiment !== null || realityCheck !== null || $match !== null || $isAvailable}
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
      {#if $isInsightsCard}
        <InsightsCard {sentiment} {realityCheck} {type} {id} />
      {:else}
        <SentimentCard {sentiment} {realityCheck} {type} {id} />
      {/if}
    {/snippet}
  </SectionList>
{/if}
